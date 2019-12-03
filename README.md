# Helsingin yliopiston Full Stack Web Development -kurssin harjoitustyö "Muistijäljet"

Kts. https://courses.helsinki.fi/en/aytkt21010/129098202 ja https://github.com/fullstackopen-2019/misc/blob/master/projekti.md
Tämä sovellus on rakennettu Full Stack Web Development -kurssille. Projekti on jaettu kahteen kahteen eri repositoryyn: toisessa Backend-toteutus ja toisessa Frontend.

## Yleistä

"Muistijäljet"-sovellus on tarkoitettu käyttäjälle, joka käyttää monia päätelaitteita ja haluaa päästä helposti käsiksi aiemmin tallennettuihin tietoihin. Sovellus mahdollistaa käyttäjälle helpon tavan tallentaa/linkittää merkityksellistä sisältöä (esim. tärkeät muistiinpanot, linkit resursseihin, joihin käyttäjä haluaa palata myöhemmin, mutta juuri kyseisellä hetkellä ei ole aikaa tai halua tehdä sitä). Kunkin tallennettavan tiedon yhteyteen tallennetaan asiasanoja, joiden mukaan sisältöjä luokitellaan ja on mahdollista hakea myöhemmin. Fronend huolehtii tietojen hakemisesta ja näyttämisestä Backendin tarjoaman API:n kautta.

## Frontend-toteutus

Frontend-toteutus rakennetaan ReactJS:n ja sopivan CSS-Frameworkin päälle. Lisäksi on tarkoitus tehdä lyhyt ekskursio React Nativeen, ja toteuttaa sillä yksinkertainen frontend mobiililaitteille.

## Järjestelmävaatimukset

- esim. Linux-palvelin, jossa käytettävissä npm/yarn ja nodejs (tämänhetkinen LTS-versio 12.13.1 toimii ainakin)
- Memorytracks-sovelluksen backend-puoli toiminnassa

## Buildaus

Frontendin tuotantoversio generoidaan komennolla _yarn run build_ ja saatu hakemisto kopioidaan halutulle serverille, jossa sitä voidaan ajaa esim. komennolla _serve -s build -l 3000_, jossa viimeinen parametri on portti, missä sovellus on ajossa. Serve komento on oltava asennettuna yarn- tai npm-pakettimanagerilla luonnollisesti ensin.

Tällä hetkellä tuotantoversio löytyy ajossa osoitteesta:
http://37.120.176.60:3000/memorytracks

## Työaikakirjanpito

[Työaikakirjanpito](https://github.com/minzen/fullstack_harjoitustyo_backend/blob/master/tyokirjanpito.md)

## Lähteet

Ohjelmistossa ikonina ja kuvana käytettävä muistiinpano-kuva on lähtöisin https://www.svgrepo.com/svg/10030/class-notes -sivustolta ja noudattaa Creative Commons BY 4.0 -lisenssiä.
