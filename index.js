import dataGeneralxsku from './components/dataGeneralsku.js';

/** Variables */
let filtersValue = {} , arrayToGraphic=[] , arrayToTable=[];

/** Actualizar los valores del filtro */
function updateValuesFilters(){
    /** tomar los valores de los selects */
    filtersValue={
        Pais        : document.body.querySelector('.selectCountry').value,
        Mes         : document.body.querySelector('.selectDate').value,
        Categoria   : document.body.querySelector('.selectCategory').value
    };
};

/** Se filtra por País por Mes y por Categría */
function filterProcess(){

    /** Nuevo Array  */
    let filterArray=[];
    
    /** Actualizamos los valores de los filtros  */
    updateValuesFilters();

    /** Empezamos el proceso de filtrado */
    filtersValue.Pais       !== "null" && ( filterArray = dataGeneralxsku.filter( registry => registry.pais == filtersValue.Pais)           );
    filtersValue.Categoria  !== "null" && ( filterArray = filterArray.filter    ( registry => registry.categoria == filtersValue.Categoria) );
    
    /** Actualizamos el array para renderizar las gráficas */
    arrayToGraphic = filterArray;
    
    filtersValue.Mes        !== "null" && ( filterArray = filterArray.filter    ( registry => registry.Mes == filtersValue.Mes)             );    

    /**Actualizamos los valores de la miga de pan */
    updateBreadCrumb()

    /** Actaulimos el array para renderizar la tabla */
    arrayToTable = filterArray;

    /** Se contruye la tabla de datos generales */
    buildTable()
};

/** Función para actualizar la miga de pan */
function updateBreadCrumb(){
    document.body.querySelector('.pais').innerHTML      = filtersValue.Pais      !== "null" ? filtersValue.Pais      : "País";
    document.body.querySelector('.mes').innerHTML       = filtersValue.Mes       !== "null" ? filtersValue.Mes       : "Mes";
    document.body.querySelector('.categoria').innerHTML = filtersValue.Categoria !== "null" ? filtersValue.Categoria : "Categoría";
};


/** ___________________ Constructores _________________ */

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
    
        elementToReturn.diference       = parseInt( ((elementToReturn.with / elementToReturn.withOut)*100).toFixed(0) );
        elementToReturn.diferenceFormat = `${parseInt(elementToReturn.diference/60)}:${parseInt(elementToReturn.diference%60)}`;

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

    /** Función para construir la estructura de las gráficas */
    function buildStructureToGraphics(array){

        /** La gráfica acepta dos arreglos con valores para renderizar */
        let elementToReturn = {}

        array.map( registry => { 
            if( !(registry.Mes in elementToReturn) ) 
            elementToReturn[registry.Mes] = null;
        })

        Object.entries(elementToReturn).forEach( ([key,value])=>{
            let 
            registry = array.filter( registry => registry.Mes == key)
            elementToReturn[key] = registry
        });

        return elementToReturn;

    };

    /** función para renderizar la grafica a partir de un array y el KPI  */
    function renderGraphic(data,kpi){

        document.body.querySelector('#myChart').remove()
        
        const 
        canvas = document.createElement('CANVAS');;
        canvas.id='myChart';
        document.body.querySelector('.containerGraphic').appendChild(canvas);

        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.months ,
                datasets: [{
                    label: kpi,
                    data: data.diferences,
                    backgroundColor: [ '#007297', ' #f47920'] 
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                barThickness: 100
            }
            
        });
    
    };

    /** función pora construir la estructura de la tabla comparativa por paises */
    function buildStructureToTable(){
        let elementToReturn = {};

        dataGeneralxsku.map( registry => { 
            if ( !(registry.pais in elementToReturn)){ elementToReturn[registry.pais] = null };
        })

        Object.entries(elementToReturn).forEach( ([key]) =>{

            let registry = dataGeneralxsku.filter( registry => registry.pais == key)
            elementToReturn[key] = registry

        })
        return elementToReturn;
    };




/** _______________ Renderizadores _______________*/

    /** Función para construir la tabla de datos generales */
    function buildTable(){

        const usability     = buildUsability(arrayToTable);
        const engagement    = buildEngagement(arrayToTable);
        const addToCar      = buildAddToCar(arrayToTable);
        const purchase      = buildPurchase(arrayToTable);

        /** Usabilidad */
        document.body.querySelector('.WOISesion').innerHTML     = usability.withOut     == "NaN" ? 0        : usability.withOut       ;
        document.body.querySelector('.WISesion').innerHTML      = usability.with        == "NaN" ? 0        : usability.with          ;
        document.body.querySelector('.DPSesion').innerHTML      = usability.diference   == "NaN" ? 0+'%'    : usability.diference+'%' ;
    
        /** Engagement */ 
        document.body.querySelector('.WOIDuration').innerHTML   = isNaN(engagement.withOut   )   ? 0        : engagement.withOut      ;
        document.body.querySelector('.WIDuration').innerHTML    = isNaN(engagement.with      )   ? 0        : engagement.with         ;
        document.body.querySelector('.DPDuration').innerHTML    = isNaN(engagement.diference )   ? 0+'%'    : engagement.diference+'%' ;
    
        /** AddTocar */ 
        document.body.querySelector('.WOIAddToCar').innerHTML   = isNaN(addToCar.withOut)        ? 0        : addToCar.withOut        ;
        document.body.querySelector('.WIAddToCar').innerHTML    = isNaN(addToCar.with   )        ? 0        : addToCar.with           ;
        document.body.querySelector('.DPAddToCar').innerHTML    = addToCar.diference    == "NaN" ? 0+'%'    : addToCar.diference+'%'  ;
    
        /**Purchase */ 
        document.body.querySelector('.WOIPurchase').innerHTML   = purchase.withOut      == "NaN" ? 0        : purchase.withOut        ;
        document.body.querySelector('.WIPurchase').innerHTML    = purchase.with         == "NaN" ? 0        : purchase.with           ;
        document.body.querySelector('.DPPurchase').innerHTML    = purchase.diference    == "NaN" ? 0+'%'    : purchase.diference+'%'  ;

    };

    /** Función para construir la gráfica de comparación */
    function buildGraphic( kpi ){

        let elementToReturn = {
            months      :[],
            diferences  :[]
        }
        const createStructure = buildStructureToGraphics(arrayToGraphic);

        switch(kpi){
            case 'usability':
                Object.entries(createStructure).forEach(([key])=>{
                    elementToReturn.months.push(key);
                    elementToReturn.diferences.push( buildUsability(createStructure[key]).diference )
                });
                break;
            case 'engagement':
                Object.entries(createStructure).forEach(([key])=>{
                    elementToReturn.months.push(key);
                    elementToReturn.diferences.push( buildEngagement(createStructure[key]).diference )
                });
                break;
            case 'addToCar':
                Object.entries(createStructure).forEach(([key])=>{
                    elementToReturn.months.push(key);
                    elementToReturn.diferences.push( buildAddToCar(createStructure[key]).diference )
                });
                break;
            case 'purchase':
                Object.entries(createStructure).forEach(([key])=>{
                    elementToReturn.months.push(key);
                    elementToReturn.diferences.push( buildPurchase(createStructure[key]).diference )
                });
                break;
        }
        renderGraphic(elementToReturn,kpi)
    };

    function buildComparationCountry(){

        let elementToReturn = {
            country     : [],
            usability   : [],
            engagement  : [],
            addTocar    : [],
            purchase    : [],
        };

        const structure = buildStructureToTable();

        Object.entries(structure).forEach(([key])=>{
            elementToReturn.country.push(key)
            elementToReturn.usability.push(buildUsability(structure[key]).diference)
            elementToReturn.engagement.push(buildEngagement(structure[key]).diference)
            elementToReturn.addTocar.push(buildAddToCar(structure[key]).diference)
            elementToReturn.purchase.push(buildPurchase(structure[key]).diference)
        });

       return elementToReturn

    }


/** Eventos que actualiza la información */
document.body.querySelector('.selectCountry' ).addEventListener('input', filterProcess , false);
document.body.querySelector('.selectDate'    ).addEventListener('input', filterProcess , false);
document.body.querySelector('.selectCategory').addEventListener('input', filterProcess , false);

/** Evento que construye la grafica */
document.body.querySelector('.kpiSelect').addEventListener('input', (e)=>{buildGraphic(e.target.value)} , false);

filterProcess();
buildComparationCountry()
