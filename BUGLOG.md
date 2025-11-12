Vaihda teema -painike jumittuu: vaihtaa ensin teeman tummaksi, ei toimi enää sen jälkeen.



&nbsp;	--> function saveTheme(T) 	{localStorage.setItem('them-preference', t); }



&nbsp;		--> typo - loadTheme hakee theme-preference,

&nbsp;		mutta saveTheme on määrittänyt them-			preference, jolloin loadTheme palautuu aina

&nbsp;		'light'



&nbsp;	--> tupla-listener vaihtaa teemaa kahdesti 	painikkeen klikkauksella



&nbsp;		--> ++/--



Haku ei tuota tuloksia, jumittuu "lataamaan". Tuottaa virheen konsolissa:



&nbsp;	app.js:30 Uncaught (in promise) TypeError: 	data.slice is not a function

&nbsp;	searchImages @ app.js:30

&nbsp;	await in searchImages

&nbsp;	(anonymous) @ app.js:37



&nbsp;	--> väärä API endpoint? ../coffee/images

&nbsp;		

&nbsp;		--> .slice on array funktio, mutta endpoint 

&nbsp;		ei palauta arrayta, siis: koodi olettaa 		arrayn olemassaolon endpointissa, mutta sitä

&nbsp;		ei ole



&nbsp;			--> syy erroriin





Kopioi tervehdys tuottaa aina selaimen viestin "Kopioitu!", vaikka ei kopioisi mitään.



&nbsp;	--> ei lupa tai https tarkastuksia, ei 	virheenkäsittelyä



&nbsp;		--> funktio ilmoittaa kopioinnin 			onnistuneen, vaikka selainturva estäisi

&nbsp;		pääsyn leikepöytään



Laskuri toimii, paitsi jos klikkaa painikkeen oikeasta laidasta numeroiden päältä. Ei vaikuta rikkoutuvan korkeammista luvuista.



&nbsp;	--> if (e.target.classList.contains('count')) 	return;

&nbsp;		--> virhe itsessään - tekee liian aikaisen

&nbsp;		palautuksen, jos klikkaa countin, eli 			klikkausmäärän kohdalta. Korjaantuu 			poistamalla koko kyseisen lausekkeen



Havainnoija "toimii", mutta huonosti; sen pitäisi näyttää laatikossaan teksti "Näkyvissä!", kun enemmän kuin 25% laatikosta on näkyvissä. Vaikka laatikko on näkyvissä kokonaan, se ei silti muutu, vaan vaatii useamman yrityksen rullata sen ympärillä, jotta teksti ilmestyy. Teksti "Näkyvissä!" myös jumittuu paikoilleen; funktio ei siis ole kovin reaktiivinen; ei käsittele tilannetta, jossa havainnoija ei näkyvissä; "cleanup puuttuu".



&nbsp;	--> IntersectionObserver ei saa optioita, jolloin	threshold on oletuksena 0.

&nbsp;	entry.intersectionRatio > 0.25, mutta koska

&nbsp;	threshold = 0, callback ei toteudu luotettavasti

&nbsp;	juuri silloin, kun havainnoijan näkyvyys on > 25%

