import dataGeneralxsku from '../dataGeneralsku.js';

let 
mes,
category;

/** Función para construir la usabilidad apartir de un array de registros */
function buildUsability(array){

    let elementToreturn = {
        with:0,
        withOut:0,
        diference:0
    };

    array.map((registry)=>{
        elementToreturn.with    += registry.conInteraccion;
        elementToreturn.withOut += registry.sinInteraccion;
    })

    elementToreturn.diference = (elementToreturn.with / ((elementToreturn.withOut + elementToreturn.with))*100).toFixed(2)
    return elementToreturn;
};

/** Función para construir el engagement apartir de un array de registros */
function buildEngagement(array){

    let elementToReturn = { with:null , withFormat:null , withOut:null , withOutFormat:null, diference:null , diferenceFormat:null } ;
    let timeWI          = { hours:0, minutes:0, seconds:0 };
    let timeWOI         = { hours:0, minutes:0, seconds:0 };

    array.map(registry=>{
        
        let WregistryHour , WregistryMinute , WregistrySec;
        let WOregistryHour, WOregistryMinute, WOregistrySec;

        WregistryHour    =  parseInt(registry.tiempoConInteraccion.split(":")[0]);
        WregistryMinute  =  parseInt(registry.tiempoConInteraccion.split(":")[1]);
        WregistrySec     =  parseInt(registry.tiempoConInteraccion.split(":")[2]);

        WOregistryHour    =  parseInt(registry.tiempoSinInteraccion.split(":")[0]);
        WOregistryMinute  =  parseInt(registry.tiempoSinInteraccion.split(":")[1]);
        WOregistrySec     =  parseInt(registry.tiempoSinInteraccion.split(":")[2]);

        timeWI.hours      += WregistryHour*60*60;
        timeWI.minutes    += WregistryMinute*60;
        timeWI.seconds    += WregistrySec;

        timeWOI.hours     += WOregistryHour*60*60;
        timeWOI.minutes   += WOregistryMinute*60;
        timeWOI.seconds   += WOregistrySec;

    });

    elementToReturn.with             = Math.ceil((timeWI.hours+timeWI.minutes+timeWI.seconds) / array.length);
    elementToReturn.withFormat       = `${parseInt(elementToReturn.with/60)}:${parseInt(elementToReturn.with%60)}`;

    elementToReturn.withOut          = Math.ceil((timeWOI.hours+timeWOI.minutes+timeWOI.seconds) / array.length);
    elementToReturn.withOutFormat    = `${parseInt(elementToReturn.withOut/60)}:${parseInt(elementToReturn.withOut%60)}`;

    elementToReturn.diference        = parseInt( ((elementToReturn.with / elementToReturn.withOut)*100).toFixed(0) );
    elementToReturn.diferenceFormat  = `${parseInt(elementToReturn.diference/60)}:${parseInt(elementToReturn.diference%60)}`;

    return elementToReturn;
};

/** Función para construir el addToCar apartir de un array de resgistros */
function buildAddToCar(array){

    let elementToReturn = {
        with: 0,
        withOut: 0,
        diference : null
    };

    array.forEach( registry => { 
        if(registry.AddToCartConInteraccion == 0 || registry.AddToCartSinInteraccion == 0){ return }
        elementToReturn.with    += parseFloat(registry.AddToCartConInteraccion.replace('%',''));   
        elementToReturn.withOut += parseFloat(registry.AddToCartSinInteraccion.replace('%',''));   
    });

    elementToReturn.with        = Math.ceil( elementToReturn.with    / array.length            );
    elementToReturn.withOut     = Math.ceil( elementToReturn.withOut / array.length            );
    elementToReturn.diference   = ((elementToReturn.with / elementToReturn.withOut)*100).toFixed(0);

    return elementToReturn;
};

/** Función para construir el purchase apartir de un array de registros */
function buildPurchase(array){

    let elementToReturn = {
        with: 0,
        withOut: 0,
        diference :0
    }

    array.forEach(element => {    
        elementToReturn.with       += element.TransaccionesConInteraccion;
        elementToReturn.withOut    += element.TransaccionesSinInteraccion;
    })

    elementToReturn.with        = (elementToReturn.with/array.length).toFixed(3);
    elementToReturn.withOut     = (elementToReturn.withOut/array.length).toFixed(3);
    elementToReturn.diference   = (elementToReturn.with/elementToReturn.withOut*100).toFixed(0);

    return elementToReturn;
};

/** Función pora construir la estructura de la tabla comparativa por paises */
function buildStructureToTable({mes,category}){

    let elementToReturn = {}, newArray = dataGeneralxsku ;

    if( mes !== "null" ){ newArray = newArray.filter(registry => mes == registry.Mes) };
    if( category !== "null"){ newArray = newArray.filter(registry => category == registry.categoria  )}

    newArray.map( registry => { 
        if ( !(registry.pais in elementToReturn)){ elementToReturn[registry.pais] = null };
    })

    Object.entries(elementToReturn).forEach( ([key]) =>{
        let registry = newArray.filter( registry => registry.pais == key)
        elementToReturn[key] = registry;
    })

    return elementToReturn;
};

/** _______________ Renderes _____________ */

    /** render usabilidad gráfica */
    function renderGraphicUsability( values ){

        /** Limpieza de la gráfica */
        document.getElementById('graphicUsabilidad').remove();

        /** Creación del elemento */
        const 
        canva = document.createElement('CANVAS');
        canva.id=`graphicUsabilidad`;
        canva.classList.add('donutGraphic');
        document.body.querySelector('#usabilityContainerCard').appendChild(canva);

        // Creación de la gráfica
        const ctx = document.body.querySelector('#graphicUsabilidad').getContext('2d');

        new Chart(ctx, {
            type: 'pie', // Tipo de gráfico (pie para gráfico tipo pie)
            data: {
                labels: [ values.country[0],values.country[1],values.country[2],values.country[3] ],
                datasets: [{
                label: 'My First Dataset',
                data: [values.usability[0],values.usability[1],values.usability[2],values.usability[3]],
                backgroundColor: [
                    '#0082acb0',
                    '#ffaf00b0',
                    '#ff8604b0',
                    '#4cbed8b0'
                ],
                hoverOffset: 4
                }]
            },
            options: {
                plugins: { legend: { display: false } } 
            }
        });

        document.body.querySelector('.colombia_usability').innerHTML    = `${values.country[0]}: ${values.usability[0]}%`;
        document.body.querySelector('.mexico_usability').innerHTML      = `${values.country[1]}: ${values.usability[1]}%`;
        document.body.querySelector('.chile_usability').innerHTML       = `${values.country[2]}: ${values.usability[2]}%`;
        document.body.querySelector('.peru_usability').innerHTML        = `${values.country[3]}: ${values.usability[3]}%`;

    };

    /** Render engagement gráfica */
    function renderGraphicEngagement(values){

        /** Limpieza de la gráfica */
        document.getElementById('graphicEngagement').remove();

        /** Creación del elemento */
        const 
        canva = document.createElement('CANVAS');
        canva.id=`graphicEngagement`;
        canva.classList.add('donutGraphic');
        document.body.querySelector('#engagementContainerCard').appendChild(canva);

        // Creación de la gráfica
        const ctx = document.body.querySelector('#graphicEngagement').getContext('2d');

        new Chart(ctx, {
            type: 'pie', // Tipo de gráfico (pie para gráfico tipo pie)
            data: {
                labels: [ values.country[0],values.country[1],values.country[2],values.country[3] ],
                datasets: [{
                label: 'My First Dataset',
                data: [values.engagement[0],values.engagement[1],values.engagement[2],values.engagement[3]],
                backgroundColor: [
                    '#0082acb0',
                    '#ffaf00b0',
                    '#ff8604b0',
                    '#4cbed8b0'
                ],
                hoverOffset: 4
                }]
            },
            options: {
                plugins: { legend: { display: false } } 
            }
        });

        document.body.querySelector('.colombia_engagement').innerHTML    = `${values.country[0]}: ${values.engagement[0]}%`;
        document.body.querySelector('.mexico_engagement').innerHTML      = `${values.country[1]}: ${values.engagement[1]}%`;
        document.body.querySelector('.chile_engagement').innerHTML       = `${values.country[2]}: ${values.engagement[2]}%`;
        document.body.querySelector('.peru_engagement').innerHTML        = `${values.country[3]}: ${values.engagement[3]}%`;


    };

    /** Render addTocar gráfica */
    function renderGraphicAddToCar(values){

        console.log('entrnando Aadd To Car')

        /** Limpieza de la gráfica */
        document.getElementById('graphicAddToCar').remove();

        /** Creación del elemento */
        const 
        canva = document.createElement('CANVAS');
        canva.id=`graphicAddToCar`;
        canva.classList.add('donutGraphic');
        document.body.querySelector('#addToCarContainerCard').appendChild(canva);

        // Creación de la gráfica
        const ctx = document.body.querySelector('#graphicAddToCar').getContext('2d');

        new Chart(ctx, {
            type: 'pie', // Tipo de gráfico (pie para gráfico tipo pie)
            data: {
                labels: [ values.country[0],values.country[1],values.country[2],values.country[3] ],
                datasets: [{
                label: 'My First Dataset',
                data: [values.addTocar[0], values.addTocar[1], values.addTocar[2], values.addTocar[3]],
                backgroundColor: [
                    '#0082acb0',
                    '#ffaf00b0',
                    '#ff8604b0',
                    '#4cbed8b0'
                ],
                hoverOffset: 4
                }]
            },
            options: {
                plugins: { legend: { display: false } } 
            }
        });

        document.body.querySelector('.colombia_addTocar').innerHTML    = `${values.country[0]}: ${values.addTocar[0]}%`;
        document.body.querySelector('.mexico_addTocar').innerHTML      = `${values.country[1]}: ${values.addTocar[1]}%`;
        document.body.querySelector('.chile_addTocar').innerHTML       = `${values.country[2]}: ${values.addTocar[2]}%`;
        document.body.querySelector('.peru_addTocar').innerHTML        = `${values.country[3]}: ${values.addTocar[3]}%`;


    };

    /** Render addTocar gráfica */
    function renderGraphicPurchase(values){

        console.log('purchase')

        /** Limpieza de la gráfica */
        document.getElementById('graphicPurchase').remove();

        /** Creación del elemento */
        const 
        canva = document.createElement('CANVAS');
        canva.id=`graphicPurchase`;
        canva.classList.add('donutGraphic');
        document.body.querySelector('#purchaseContainerCard').appendChild(canva);

        // Creación de la gráfica
        const ctx = document.body.querySelector('#graphicPurchase').getContext('2d');

        new Chart(ctx, {
            type: 'pie', // Tipo de gráfico (pie para gráfico tipo pie)
            data: {
                labels: [ values.country[0],values.country[1],values.country[2],values.country[3] ],
                datasets: [{
                label: 'My First Dataset',
                data: [values.purchase[0], values.purchase[1], values.purchase[2], values.purchase[3]],
                backgroundColor: [
                    '#0082acb0',
                    '#ffaf00b0',
                    '#ff8604b0',
                    '#4cbed8b0'
                ],
                hoverOffset: 4
                }]
            },
            options: {
                plugins: { legend: { display: false } } 
            }
        });

        document.body.querySelector('.colombia_purchase').innerHTML    = `${values.country[0]}: ${values.purchase[0]}%`;
        document.body.querySelector('.mexico_purchase').innerHTML      = `${values.country[1]}: ${values.purchase[1]}%`;
        document.body.querySelector('.chile_purchase').innerHTML       = `${values.country[2]}: ${values.purchase[2]}%`;
        document.body.querySelector('.peru_purchase').innerHTML        = `${values.country[3]}: ${values.purchase[3]}%`;


    };

/** Función para renderizar la tabla comparativa  */
function buildComparationCountry(mes,category){

    let elementToReturn = {
        country     : [],
        usability   : [],
        engagement  : [],
        addTocar    : [],
        purchase    : [],
    };

    const structure = buildStructureToTable({mes,category});

    Object.entries(structure).forEach(([key])=>{
        elementToReturn.country.push(key)
        elementToReturn.usability.push(buildUsability(structure[key]).diference)
        elementToReturn.engagement.push(buildEngagement(structure[key]).diference)
        elementToReturn.addTocar.push(buildAddToCar(structure[key]).diference)
        elementToReturn.purchase.push(buildPurchase(structure[key]).diference)
    });

    renderGraphicUsability(elementToReturn);
    renderGraphicEngagement(elementToReturn);
    renderGraphicAddToCar(elementToReturn);
    renderGraphicPurchase(elementToReturn)
};


/** eventos input */
document.body.querySelector('.selectDate').addEventListener('input',()=>{
    mes         = document.body.querySelector('.selectDate').value,
    category    = document.body.querySelector('.selectCategory').value;
    buildComparationCountry(mes, category);
});

document.body.querySelector('.selectCategory').addEventListener('input',()=>{

    mes         = document.body.querySelector('.selectDate').value,
    category    = document.body.querySelector('.selectCategory').value;

    console.log(category)
    buildComparationCountry(mes, category);
});


/** Valores inciiales */
mes         = document.body.querySelector('.selectDate').value,
category    = document.body.querySelector('.selectCategory').value;
buildComparationCountry( mes,category );