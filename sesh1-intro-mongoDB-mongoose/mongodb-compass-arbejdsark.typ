#import "../../../shared/templates/worksheet-template.typ": *

#show: worksheet.with(
  title: "MongoDB Compass - Introduktion til CRUD",
  session: 1,
  course: "WEB-SQL F26",
  keywords: ("MongoDB", "Compass", "CRUD", "Documents", "Collections", "Embedded", "References"),
  resources: (
    (name: "MongoDB Compass", url: "https://www.mongodb.com/products/compass"),
    (name: "MongoDB Atlas", url: "https://cloud.mongodb.com/"),
    (name: "MongoDB Dokumentation", url: "https://www.mongodb.com/docs/manual/"),
  )
)

= Introduktion

#explain[
  I dette arbejdsark skal I arbejde med MongoDB gennem *MongoDB Compass* - det grafiske interface til MongoDB. Vi vil oprette en database til en fiktiv boghandel og øve de grundlæggende CRUD-operationer (Create, Read, Update, Delete).
  
  *Forudsætninger:*
  - I har oprettet en MongoDB Atlas konto (som forberedelse), og lavet en tom cluster der køre i skyen.
  - I har downloadet og installeret MongoDB Compass
]

#task(title: "Forbind til MongoDB Atlas")[
  
  I denne øvelse skal I forbinde MongoDB Compass til jeres MongoDB Atlas cluster.
  
  #subtask[
    Log ind på #link("https://cloud.mongodb.com/")[MongoDB Atlas] og find jeres cluster. Klik på *"Connect"* og vælg *"Connect with MongoDB Compass"*.
  ]
  
  #subtask[
    Kopiér connection string'en. Den ser cirka sådan ud:
    ```
    mongodb+srv://<brugernavn>:<password>@cluster0.xxxxx.mongodb.net/
    ```
    
    #note[
      Husk at erstatte `<password>` med jeres faktiske password!
    ]
  ]
  
  #subtask[
    Åbn MongoDB Compass og indsæt connection string'en i *"New Connection"* feltet. Klik *"Connect"*.
  ]
  
  #subtask[
    Verificér at I er forbundet ved at se jeres cluster i venstre sidebar. I skulle kunne se nogle system-databaser som `admin` og `local`.
  ]
  
]

= Del 2: Create - Opret data

#explain[
  Vi skal nu oprette en database til en boghandel. I MongoDB oprettes databaser og collections automatisk når vi indsætter det første dokument. Vi vil arbejde med tre typer data: *bøger*, *forfattere* og *ordrer*.
]

#task(title: "Opret database og første dokumenter")[

  #subtask[
    I MongoDB Compass, klik på *"+"* ved siden af "Databases" i venstre sidebar. Opret en ny database med navnet `boghandel` og en collection kaldet `boeger`.
  ]
  
  #subtask[
    Klik på `boeger` collection'en og derefter på *"Add Data"* → *"Insert Document"*. Indsæt følgende bog:
    
    ```json
    {
      "titel": "Clean Code",
      "forfatter": "Robert C. Martin",
      "udgivet": 2008,
      "pris": 299.95,
      "genre": ["programmering", "software engineering"],
      "paa_lager": true,
      "antal_sider": 464
    }
    ```
    
    #note[
      Bemærk at `genre` er et *array* - MongoDB håndterer arrays naturligt uden ekstra tabeller!
    ]
  ]
  
  #subtask[
    Indsæt nu en bog mere, men denne gang med *embedded* forfatterinformation:
    
    ```json
    {
      "titel": "The Pragmatic Programmer",
      "forfatter": {
        "navn": "David Thomas",
        "nationalitet": "Britisk",
        "medforfatter": "Andrew Hunt"
      },
      "udgivet": 2019,
      "pris": 349.00,
      "genre": ["programmering", "karriere"],
      "paa_lager": true
    }
    ```
    
    #hint[
      Dette viser et *embedded document* - forfatterinfo er gemt direkte i bogdokumentet. Sammenlign med den første bog hvor forfatter bare var en string.
    ]
  ]
  
  #subtask[
    Tilføj mindst 3 flere bøger selv. Sørg for at:
    - Mindst én bog har `paa_lager: false`
    - Mindst én bog koster over 400 kr
    - Mindst én bog har et andet felt som de andre ikke har (f.eks. `sprog`, `isbn`, eller `anmeldelser`)
    
    #note[
      MongoDB er *schema-less* - hvert dokument kan have forskellige felter! Dette er fundamentalt anderledes end SQL.
    ]
  ]
]

#task(title: "Arbejd med References")[

  Nu skal vi se hvordan *references* fungerer - altså hvor vi gemmer relateret data i separate collections og linker dem via ID.
  
  #subtask[
    Opret en ny collection kaldet `forfattere` i `boghandel` databasen. Indsæt følgende forfatter:
    
    ```json
    {
      "navn": "Martin Fowler",
      "nationalitet": "Britisk",
      "foedselsaar": 1963,
      "speciale": ["software arkitektur", "refactoring"]
    }
    ```
    
    Når dokumentet er oprettet, *noter dig* det autogenererede `_id` felt (det lange ObjectId).
  ]
  
  #subtask[
    Gå tilbage til `boeger` collection'en og opret en ny bog der *refererer* til forfatteren via ID:
    
    ```json
    {
      "titel": "Refactoring",
      "forfatter_id": ObjectId("INDSÆT_DIT_ID_HER"),
      "udgivet": 2018,
      "pris": 449.00,
      "genre": ["programmering", "refactoring"],
      "paa_lager": true
    }
    ```
    
    #note[
      Erstat `INDSÆT_DIT_ID_HER` med det faktiske ObjectId fra jeres forfatter-dokument!
    ]
  ]
  
  #discuss[
    Hvad er fordele og ulemper ved *embedded documents* vs *references*? Hvornår ville I bruge hvad?
  ]
]

= Del 3: Read - Hent og filtrer data

#explain[
  Nu skal vi øve at hente data fra databasen med forskellige filtre og projections. I Compass kan I bruge *Filter*-feltet til at skrive queries.
]

#task(title: "Grundlæggende Read-operationer")[

  #subtask[
    I `boeger` collection'en, brug Filter-feltet til at finde alle bøger der er på lager:
    
    ```json
    { "paa_lager": true }
    ```
    
    Tryk på *"Find"* for at udføre query'en.
  ]
  
  #subtask[
    Find alle bøger udgivet efter 2015:
    
    ```json
    { "udgivet": { "$gt": 2015 } }
    ```
    
    #note[
      `$gt` betyder "greater than" (større end). Andre operatorer inkluderer `$lt` (less than), `$gte` (greater than or equal), `$lte` (less than or equal).
    ]
  ]
  
  #subtask[
    Find alle bøger der koster mellem 200 og 400 kr:
    
    ```json
    { "pris": { "$gte": 200, "$lte": 400 } }
    ```
  ]
  
  #subtask[
    Find bøger med "programmering" i genre-arrayet:
    
    ```json
    { "genre": "programmering" }
    ```
    
    #hint[
      MongoDB søger automatisk i arrays! Du behøver ikke special-syntax for at matche array-elementer.
    ]
  ]
  
  #subtask[
    Brug *Project*-feltet (under Options i Compass) til kun at vise titel og pris:
    
    ```json
    { "titel": 1, "pris": 1, "_id": 0 }
    ```
    
    #note[
      `1` betyder "vis dette felt", `0` betyder "skjul dette felt". `_id` vises som default, så vi skal eksplicit skjule det.
    ]
  ]
]

= Del 4: Update - Opdater data

#explain[
  MongoDB har forskellige update-operatorer til at modificere dokumenter. Vi vil bruge dem til at opdatere vores bogdata.
]

#task(title: "Opdater dokumenter")[

  #subtask[
    Find en specifik bog ved titel og opdater prisen. I Compass kan I:
    1. Klikke på dokumentet
    2. Klikke på *"Edit"* ikonet (blyanten)
    3. Ændre værdien og klikke *"Update"*
    
    Alternativt kan I bruge *"Update"* fanen og skrive:
    
    *Filter:*
    ```json
    { "titel": "Clean Code" }
    ```
    
    *Update:*
    ```json
    { "$set": { "pris": 279.95 } }
    ```
  ]
  
  #subtask[
    Tilføj et nyt felt `rabat` til alle bøger der koster over 400 kr:
    
    *Filter:*
    ```json
    { "pris": { "$gt": 400 } }
    ```
    
    *Update:*
    ```json
    { "$set": { "rabat": true } }
    ```
    
    #note[
      Brug *"Update Many"* for at opdatere alle matchende dokumenter!
    ]
  ]
  
  #subtask[
    Tilføj et nyt genre-element til en eksisterende bog med `$push`:
    
    *Filter:*
    ```json
    { "titel": "Clean Code" }
    ```
    
    *Update:*
    ```json
    { "$push": { "genre": "best practices" } }
    ```
    
    #hint[
      `$push` tilføjer et element til et array. `$pull` fjerner et element. `$addToSet` tilføjer kun hvis elementet ikke allerede findes.
    ]
  ]
  
  #subtask[
    Reducér lagerbeholdningen ved at sætte `paa_lager` til `false` for den ældste bog (laveste udgivelsesår):
    
    1. Find først bogen med det laveste udgivelsesår
    2. Opdater dokumentet
    
    *Skriv hvilken query du brugte:*
    #v(2em)
  ]
]

= Del 5: Delete - Slet data

#explain[
  Til sidst skal vi øve at slette dokumenter. *Vær forsigtig* - sletninger kan ikke fortrydes!
]

#task(title: "Slet dokumenter")[

  #subtask[
    Find først alle bøger der IKKE er på lager:
    
    ```json
    { "paa_lager": false }
    ```
    
    Notér hvor mange dokumenter der matcher.
  ]
  
  #subtask[
    Slet *ét* dokument der ikke er på lager. I Compass kan I:
    1. Hovere over dokumentet
    2. Klikke på skraldespandsikonet
    3. Bekræfte sletningen
    
    Eller bruge *Delete* fanen med filter:
    ```json
    { "paa_lager": false }
    ```
  ]
  
  #subtask[
    Opret en "test" bog som vi kan slette:
    
    ```json
    {
      "titel": "Test Bog - Slet Mig",
      "test": true,
      "pris": 0
    }
    ```
    
    Slet derefter bogen ved at filtrere på `{ "test": true }`.
  ]
  
  #subtask[
    Forestil jer at I skal slette alle bøger der:
    - Ikke er på lager OG
    - Koster mindre end 100 kr
    
    *Skriv den filter-query I ville bruge (UDFØR DEN IKKE):*
    
    #hint[
      Brug `$and` operatoren eller implicit AND ved at inkludere begge betingelser i samme objekt.
    ]
    
    #v(2em)
  ]
  
  #discuss[
    I SQL kan vi bruge `TRUNCATE` eller `DROP TABLE` til at slette alt. Hvad ville de tilsvarende operationer være i MongoDB? (Hint: Højreklik på collection i Compass)
  ]
]

= Opsummering

#explain(highlight: true)[
  *I dette arbejdsark har I lært:*
  
  - At forbinde til MongoDB Atlas via Compass
  - At oprette databaser og collections
  - Forskellen på *embedded documents* og *references*
  - Grundlæggende CRUD operationer i MongoDB
  - At bruge filter-operatorer som `$gt`, `$lt`, `$gte`, `$lte`
  - At opdatere med `$set`, `$push` og andre operatorer
  - At slette dokumenter forsvarligt
  
  *Næste gang:* Mongoose - arbejde med MongoDB fra Node.js applikationer
]

#challenge[
  *Ekstra udfordring:*
  
  Opret en `ordrer` collection med dokumenter der kombinerer embedded documents OG references:
  
  ```json
  {
    "ordre_nummer": 1001,
    "kunde": {
      "navn": "Anders Andersen",
      "email": "anders@example.dk"
    },
    "varer": [
      { "bog_id": ObjectId("..."), "antal": 2 },
      { "bog_id": ObjectId("..."), "antal": 1 }
    ],
    "total": 899.90,
    "status": "afsendt",
    "oprettet": { "$date": "2026-01-22T10:30:00Z" }
  }
  ```
  
  Opret mindst 2 ordrer og prøv at finde alle ordrer for en specifik kunde.
]
