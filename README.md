# Helsingin yliopiston Full Stack Web Development -kurssin harjoitustyö "Muistijäljet"

Kts. https://courses.helsinki.fi/en/aytkt21010/129098202 ja https://github.com/fullstackopen-2019/misc/blob/master/projekti.md
Tämä sovellus on rakennettu Full Stack Web Development -kurssille. Projekti on jaettu kahteen kolmeen eri repositoryyn: [ensimmäisessä Backend-toteutus](https://github.com/minzen/fullstack_harjoitustyo_backend) ja [toisessa normaali Frontend](https://github.com/minzen/fullstack_harjoitustyo_frontend) ja [kolmannessa](https://github.com/minzen/fullstackharjoitustyoreactnative) kokeellinen React Native -toteutus.

## Yleistä

"Muistijäljet"-sovellus on tarkoitettu käyttäjälle, joka käyttää monia päätelaitteita ja haluaa päästä helposti käsiksi aiemmin tallennettuihin tietoihin. Sovellus mahdollistaa käyttäjälle helpon tavan tallentaa/linkittää merkityksellistä sisältöä (esim. tärkeät muistiinpanot, linkit resursseihin, joihin käyttäjä haluaa palata myöhemmin, mutta juuri kyseisellä hetkellä ei ole aikaa tai halua tehdä sitä). Kunkin tallennettavan tiedon yhteyteen tallennetaan asiasanoja, joiden mukaan sisältöjä luokitellaan ja on mahdollista hakea myöhemmin. Frontend huolehtii tietojen hakemisesta ja näyttämisestä Backendin tarjoaman API:n kautta.

## Frontend-toteutus

Frontend-toteutus on rakennettu ReactJS:n ja Material UI -frameworkin päälle. Rinnakkaisessa repositoryssä (kts. linkki ylhäältä) on rakennettu yksinkertainen frontend mobiililaitteille React Nativeä käyttäen.

## Järjestelmävaatimukset

- esim. Linux-palvelin, jossa käytettävissä npm/yarn ja nodejs (tämänhetkinen LTS-versio 12.13.1 toimii ainakin)
- Memorytracks-sovelluksen backend-puoli toiminnassa

## Buildaus

Frontendin tuotantoversio generoidaan komennolla _yarn run build_. Tällöin webpack kääntää koodin tuotantomuotoiseksi ja saatu hakemisto kopioidaan halutulle serverille, jossa sitä voidaan ajaa esim. komennolla _serve -s build -l 3000_, jossa viimeinen parametri on portti, missä sovellus on ajossa. Serve-komento on oltava luonnollisesti asennettuna yarn- tai npm-pakettimanagerilla ensin.

Tällä hetkellä tuotantoversio löytyy ajossa osoitteesta:
https://minzen.github.io/fullstack_harjoitustyo_frontend/. End-to-end-testeille tarkoitettu frontend löytyy osoitteesta (https://agile-dusk-61060.herokuapp.com/)[https://agile-dusk-61060.herokuapp.com]

## E2E-testien ajaminen

Projektiin sisältyy joukko End-To-End-testejä, jotka on toteutettu Cypress-frameworkkiä käyttäen. Testien ajaminen tapahtuu komennolla _yarn run cypress:open_. Tätä ennen Backend on käynnistettävä komennolla _yarn run e2e_. Tällöin käyttöön otetaan keskusmuistissa ajettava MongoDB-instanssi, joka on helppo palauttaa haluttuun tilaan ennen testejä.

## Käytettyjä teknologioita

- React JS
- GraphQL + Apollo Client ja muita Apollo-kirjastoja
- Material UI
- ESLint
- Webpack
- i18next
- Cypress.io

## Työaikakirjanpito

[Työaikakirjanpito](https://github.com/minzen/fullstack_harjoitustyo_backend/blob/master/tyokirjanpito.md)

## Lähteet

Ohjelmistossa ikonina ja kuvana käytettävä muistiinpano-kuva on lähtöisin https://www.svgrepo.com/svg/10030/class-notes -sivustolta ja noudattaa Creative Commons BY 4.0 -lisenssiä.
