import dataGeneralxsku from '../dataGeneralsku.js';

/** Variables */
let 
filtersValue = {} , 
arrayToGraphic=[] , 
arrayToTable=[],
arrayToGraphicAll =[],
kpiActual = ['usabilidad','añadir al carrito','conversion'],
paisActual =['Colombia','México','Chile','Perú'],
paisActualCat =['Colombia','México','Chile','Perú']
// categoryActual = ['Aires','Calentadores','Campanas','Lavado','Refrigeración','Empotre','Estufas','Globales','Congelador']


/** Actualizar los valores del filtro */
function updateValuesFilters(){
    /** tomar los valores de los selects */
    filtersValue={
        Pais        : document.body.querySelector('.selectCountry').value,
        Mes         : document.body.querySelector('.selectDate').value,
        Categoria   : document.body.querySelector('.selectCategory').value,
        Sku         : document.body.querySelector('.selectSku').value
    };
};


/** Se filtra por País por Mes y por Categría */
function filterProcess() {
    /** Nuevo Array  */
    let filterArray = [];
    
    /** Actualizamos los valores de los filtros  */
    updateValuesFilters();

    /** Empezamos el proceso de filtrado */
    filtersValue.Pais !== "null" && (filterArray = dataGeneralxsku.filter(registry => registry.pais == filtersValue.Pais));

    /** Actualizamos el array para renderizar las gráficas */
    arrayToGraphic = filterArray;
    
    filtersValue.Categoria !== "null" && (filterArray = filterArray.filter(registry => registry.categoria == filtersValue.Categoria));
    filtersValue.Mes !== "null" && (filterArray = filterArray.filter(registry => registry.Mes == filtersValue.Mes));
    filtersValue.Sku !== "null" && (filterArray = filterArray.filter(registry => registry.sku == filtersValue.Sku));

    /** Actualizamos el array para renderizar la tabla */
    arrayToTable = filterArray;

    /** Agrupar los datos por país */
    const groupedByCountry = dataGeneralxsku.reduce((acc, registry) => {
        if (!acc[registry.pais]) {
            acc[registry.pais] = [];
        }
        acc[registry.pais].push(registry);
        return acc;
    }, {});

    /** Crear el array para `arrayToGraphicUsabillity` */
    arrayToGraphicAll = Object.values(groupedByCountry);
    createOptionSku(arrayToGraphic);

    /** Se construye la tabla de datos generales */
    buildTable();
}


/** función para creación de lista de SKUS */
function createOptionSku(array){

    document.body.querySelector('.selectSku').innerHTML=``;
    document.body.querySelector('.selectSku').innerHTML+=`<option value="null">Seleccione SKU</option>`

    array.map( registry =>{
        
        if (registry.sku == "null" || registry.sku == "Null" || registry.sku == "") { return };
        document.body.querySelector('.selectSku').innerHTML+=`<option value="${registry.sku}">${registry.sku}</option>`
    })

}


/** ___________________ Constructores _________________ */

    /** Función para construir la usabilidad apartir de un array de registros */
    function buildUsabilityByCountry(array) {
        let countriesData = {};
    
        array.forEach((registry) => {
            if (!countriesData[registry.pais]) {
                countriesData[registry.pais] = {
                    with: 0,
                    withOut: 0,
                    difference: 0
                };
            }
    
            countriesData[registry.pais].with += registry.conInteraccion;
            countriesData[registry.pais].withOut += registry.sinInteraccion;
        });
    
        // Calculamos la diferencia para cada país
        for (let country in countriesData) {
            let countryData = countriesData[country];
            countryData.difference = ((countryData.with / (countryData.withOut + countryData.with)) * 100).toFixed(0);
        }
        return countriesData;
        
    }
    buildUsabilityByCountry(dataGeneralxsku);
    
    function buildUsabilityByCountryAndCategory(array) {
        let countriesData = {};
    
        array.forEach((registry) => {
            if (!countriesData[registry.pais]) {
                countriesData[registry.pais] = {};
            }
    
            if (!countriesData[registry.pais][registry.categoria]) {
                countriesData[registry.pais][registry.categoria] = {
                    with: 0,
                    withOut: 0,
                    difference: 0
                };
            }
    
            countriesData[registry.pais][registry.categoria].with += registry.conInteraccion;
            countriesData[registry.pais][registry.categoria].withOut += registry.sinInteraccion;
        });
    
        // Calculamos la diferencia para cada país y categoría
        for (let country in countriesData) {
            for (let category in countriesData[country]) {
                let categoryData = countriesData[country][category];
                let total = categoryData.with + categoryData.withOut;
                if (total > 0) {
                    categoryData.difference = ((categoryData.with / total) * 100).toFixed(0);
                } else {
                    categoryData.difference = null;
                }
            }
        }
        return countriesData;
    }
    
     buildUsabilityByCountryAndCategory(dataGeneralxsku);

    // Función usabilidad general
    function buildUsability(array){
        let elementToreturn = {
            paises:null,
            with:0,
            withOut:0,
            diference:0
        };

        array.map((registry)=>{
            elementToreturn.with    += registry.conInteraccion;
            elementToreturn.withOut += registry.sinInteraccion;
            elementToreturn.paises   = registry.pais;
           
        })
       
        elementToreturn.diference = (elementToreturn.with / ((elementToreturn.withOut + elementToreturn.with))*100).toFixed(0)
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
            paises:null,
            with: 0,
            withOut: 0,
            diference : null, 
            numberSessionWI: 0,
            numberSessionWIO: 0 
        };

        array.forEach( registry => { 
            if(registry.AddToCartConInteraccion == 0 || registry.AddToCartSinInteraccion == 0){ return }
            elementToReturn.with    += parseFloat(registry.AddToCartConInteraccion.replace('%',''));   
            elementToReturn.withOut += parseFloat(registry.AddToCartSinInteraccion.replace('%',''));
            elementToReturn.numberSessionWI   += registry.AddToCartConI_sesiones
            elementToReturn.numberSessionWIO  += registry.AddToCartSinI_sesiones
            elementToReturn.paises = registry.pais
          
          
          
        });
         
        elementToReturn.with              = Math.ceil( elementToReturn.with    / array.length            );
        elementToReturn.withOut           = Math.ceil( elementToReturn.withOut / array.length            );
        elementToReturn.diference         = ((elementToReturn.with / elementToReturn.withOut)*100).toFixed(0);
        return elementToReturn;
    };

    /** Función para construir el purchase apartir de un array de registros */
    function buildPurchase(array) {
        let elementToReturn = {
            paises: null,
            with: 0,
            withOut: 0,
            diference: 0,
            numberTransactionsWI: 0,
            numberTransactionsWIO: 0,
            sessionsWith: 0,
            sessionesWithout: 0
        };
    
        array.forEach(element => {
            elementToReturn.sessionsWith += element.conInteraccion;
            elementToReturn.sessionesWithout += element.sinInteraccion;
            elementToReturn.with += element.TransaccionesConInteraccion;
            elementToReturn.withOut += element.TransaccionesSinInteraccion;
            elementToReturn.numberTransactionsWI += element.NumeroTransaccionesCon;
            elementToReturn.numberTransactionsWIO += element.NumeroTransaccionesSin;
        });
    
        elementToReturn.with = elementToReturn.sessionsWith > 0 ? (elementToReturn.numberTransactionsWI / elementToReturn.sessionsWith).toFixed(3) : 0;
        elementToReturn.withOut = elementToReturn.sessionesWithout > 0 ? (elementToReturn.numberTransactionsWIO / elementToReturn.sessionesWithout).toFixed(3) : 0;
    
        // Validar que elementToReturn.withOut no sea cero para evitar división por cero
        if (elementToReturn.withOut > 0) {
            elementToReturn.diference = (elementToReturn.with / elementToReturn.withOut * 100).toFixed(0);
        } else {
            elementToReturn.diference = 0;
        }
        return elementToReturn;
    };

    /** Función para construir la información del dispositivo */

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

        /** Función para renderizar la grafica de la card usabilidad */
        function graphicUsability(object){
            document.body.querySelector('.graphicUsabilityRender').innerHTML = ``;

            const 
            canvas = document.createElement('CANVAS');
            canvas.id="chartUsability";
            canvas.classList.add('graphicTableKpi');

            document.body.querySelector('.graphicUsabilityRender').appendChild(canvas);

            const ctx = document.body.querySelector('#chartUsability').getContext('2d');

            new Chart(ctx, {
                type: 'bar',
                data: {
                  labels: ['Sin', 'Con'],
                  datasets: [{
                    label: 'Sin VS Con',
                    data: [object.withOut, object.with], // El primer valor es el valor de la referencia
                    borderWidth: 1,
                    backgroundColor: ['#ffaf00', '#0082ac'],
                    barThickness: 40,
                    borderWidth: 3,
                    borderRadius: 10
                  }]
                },
                options: {
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  },
                  plugins: {
                    legend: {
                      display: false, 
                      position: 'top' 
                    }
                  }
                }
            });
            
        };

        /** Función para renderizar la grafica de la card Engagement */
        function graphicEngagement(object){

            document.body.querySelector('.graphicEngagementRender').innerHTML = ``;

            const 
            canvas = document.createElement('CANVAS');
            canvas.id="chartEngagement";
            canvas.classList.add('graphicTableKpi');

            document.body.querySelector('.graphicEngagementRender').appendChild(canvas);

            const ctx = document.body.querySelector('#chartEngagement').getContext('2d');

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Sin', `Con`],
                    datasets: [{
                    label: 'Sin VS Con',
                    data: [object.withOut, object.with], // El primer valor es el valor de la referencia
                    borderWidth: 1,
                    backgroundColor: ['#ffaf00', '#0082ac'],
                    barThickness: 40,
                    borderWidth: 3,
                    borderRadius: 10
                    }]
                },
                options: {
                    scales: {
                    y: {
                        beginAtZero: true
                    }
                    },
                    plugins: {
                        legend: {
                          display: false, 
                          position: 'top' 
                        }
                      }
                }
            });
            
        };

        /** Función para renderizar la gráfica de la card Add To Car*/
        function graphicAddToCar(object){

            document.body.querySelector('.graphicAddToCarRender').innerHTML = ``;

            const 
            canvas = document.createElement('CANVAS');
            canvas.id="chartAddToCar";
            canvas.classList.add('graphicTableKpi');

            document.body.querySelector('.graphicAddToCarRender').appendChild(canvas);

            const ctx = document.body.querySelector('#chartAddToCar').getContext('2d');

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Sin', `Con`],
                    datasets: [{
                    label: 'Sin VS Con',
                    data: [object.withOut, object.with], // El primer valor es el valor de la referencia
                    borderWidth: 1,
                    backgroundColor: ['#ffaf00', '#0082ac'],
                    barThickness: 40,
                    borderWidth: 3,
                    borderRadius: 10
                    }]
                },
                options: {
                    scales: {
                    y: {
                        beginAtZero: true
                    }
                    },
                    plugins: {
                        legend: {
                          display: false, 
                          position: 'top' 
                        }
                      }
                }
            });

        };

        /** Función para renderizar la gráfica de Conversión */
        function graphicPurchase(object){

            document.body.querySelector('.graphicPurchaseRender').innerHTML = ``;

            const 
            canvas = document.createElement('CANVAS');
            canvas.id="chartPurchase";
            canvas.classList.add('graphicTableKpi');

            document.body.querySelector('.graphicPurchaseRender').appendChild(canvas);

            const ctx = document.body.querySelector('#chartPurchase').getContext('2d');

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Sin', `Con`],
                    datasets: [{
                    label: 'Sin VS Con',
                    data: [object.withOut, object.with], // El primer valor es el valor de la referencia
                    borderWidth: 1,
                    backgroundColor: ['#ffaf00', '#0082ac'],
                    barThickness: 40,                    
                    borderWidth: 3,
                    borderRadius: 10
                    }]
                },
                options: {
                    scales: {
                    y: {
                        beginAtZero: true
                    }
                    },
                    plugins: {
                        legend: {
                          display: false, 
                          position: 'top' 
                        }
                      }
                }
            });
        };



    /** Función para renderizar la gráfica para la comparación de kpis x país  */
    function renderComparationGraphic(data, kpis) {    
        // Remover el canvas existente
        document.body.querySelector('#historicGraphic').remove();
        // Crear y añadir un nuevo canvas
        const canvas = document.createElement('CANVAS');
        canvas.id = 'historicGraphic';
        canvas.classList.add('historicGraphicClass');
        document.body.querySelector('.containerHistoricGraphic').appendChild(canvas);
    
        var ctx = document.getElementById('historicGraphic').getContext('2d');
    
        // Crear los datasets para cada KPI
        const datasets = kpis.map((kpi, index) => ({
            label: kpi,
            data: data[kpi].diferences,
            backgroundColor: [ '#007297', '#f47920', '#ffaf00'][index % 3],
            borderColor: [ '#007297', '#f47920', '#ffaf00'][index % 3],
            fill: false,
            pointRadius: 5,
            pointHoverRadius: 10
        }));


        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.months,
                datasets: datasets
            },
            options: {
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Indicadores por país',
                        color: '#0082ac',
                        font: {
                            size: 18
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                barThickness: 100
            }
        });
    }



    /** Función para renderizar la gráfica para la comparación de Usabilidad  */
    function renderComparationGraphicUsability(data, paises) {
        // Remover el canvas existente
        const existingCanvas = document.getElementById('chartCountryUsability');
        if (existingCanvas) {
            existingCanvas.remove();
        }
    
        // Crear y añadir un nuevo canvas
        const canvas = document.createElement('CANVAS');
        canvas.id = 'chartCountryUsability';
        canvas.classList.add('graphicTableUsability');
        document.querySelector('.containerGraphicUsability').appendChild(canvas);
    
        const ctx = document.getElementById('chartCountryUsability').getContext('2d');
    
        // Crear los datasets para cada país
        const datasets = paises.map((pais, index) => ({
            label: pais,
            data: data[pais].differences,
            backgroundColor: ['#007297', '#f47920', '#ffaf00','#bf0e09'][index % 4],
            borderColor: ['#007297', '#f47920', '#ffaf00','#bf0e09'][index % 4],
            fill: false,
            pointRadius: 3,
            pointHoverRadius: 10
        }));
    
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.months,
                datasets: datasets
            },
            options: {
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Usabilidad por país',
                        color: '#0082ac',
                        font: {
                            size: 18
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                barThickness: 100
            }
        });
    }
    
    function renderCategoryGraphicUsability(data, selectedCountry) {
        console.log(data);
        // Remover el canvas existente
        document.body.querySelector('#CategoryGraphic').remove();
        // Crear y añadir un nuevo canvas
        const canvas = document.createElement('CANVAS');
        canvas.id = 'CategoryGraphic';
        canvas.classList.add('CategoryGraphicClass');
        document.body.querySelector('.containerCategoryGraphic').appendChild(canvas);
    
        var ctx = document.getElementById('CategoryGraphic').getContext('2d');
    
        // Colores predefinidos para las categorías
        const predefinedColors = [
            '#007297', // Color 1
            '#f47920', // Color 2
            '#ffaf00', // Color 3
            '#bf0e09', // Color 4
            '#606060', // Color 5
            '#19212b', // Color 6
            '#154259'  // Color 7
        ];
    
        // Crear los datasets para el país seleccionado y sus categorías
        const datasets = [];
        const categoryColors = {};
    
        if (data.hasOwnProperty(selectedCountry)) {
            const months = Object.keys(data[selectedCountry]);
    
            // Filtrar las categorías que tienen valores diferentes de 0 o '0'
            const validCategories = Object.keys(data[selectedCountry][months[0]]).filter(category => {
                return months.some(month => {
                    const value = data[selectedCountry][month][category];
                    return value !== undefined && value !== '' && value !== 'NaN' && value !== null && value !== '0';
                });
            });
    
            validCategories.forEach(category => {
                // Asignar un color a la categoría si no se ha asignado aún
                if (!categoryColors.hasOwnProperty(category)) {
                    categoryColors[category] = predefinedColors[Object.keys(categoryColors).length % predefinedColors.length];
                }
                const color = categoryColors[category];
    
                const categoryData = {
                    label: category,
                    data: [],
                    backgroundColor: color,
                    borderColor: color, // Usar el mismo color para el borde
                    fill: false,
                    pointRadius: 3,
                    pointHoverRadius: 3
                };
    
                months.forEach(month => {
                    const value = parseFloat(data[selectedCountry][month][category]) || 0;
                    categoryData.data.push(value);
                });
    
                datasets.push(categoryData);
            });
        }
    
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.months, // Utilizar los meses proporcionados en los datos
                datasets: datasets
            },
            options: {
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: `Categorías por país: ${selectedCountry}`,
                        color: '#0082ac',
                        font: {
                            size: 18
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: false,
                        }
                    },
                    x: {
                        type: 'category', // Asegura que el tipo del eje x sea 'category'
                        title: {
                            display: false,
                        }
                    }
                },
                barThickness: 100
            }
        });
    }
    // Función para obtener los meses únicos del conjunto de datos
    function getUniqueMonths(data) {
        const validMonths = ['Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'];
        let monthsSet = new Set();
        for (let country in data) {
            for (let month in data[country]) {
                if (validMonths.includes(month)) {
                    monthsSet.add(month);
                }
            }
        }
        return Array.from(monthsSet).sort((a, b) => validMonths.indexOf(a) - validMonths.indexOf(b)); // Ordena según la lista de meses válida
    }
    
    

/** _______________ Renderizadores _______________*/

    /** Función para construir la tabla de datos generales */
    function buildTable(){

        const usability     = buildUsability(arrayToTable);
        const engagement    = buildEngagement(arrayToTable);
        const addToCar      = buildAddToCar(arrayToTable);
        const purchase      = buildPurchase(arrayToTable);

        /** Imprimiendo la usabilidad Con y Sin interacción */
        document.body.querySelector('.usabilityWith').innerHTML     = `Con interacción: <span class="valorKPI">${usability.with}</span>`;
        document.body.querySelector('.usabilityWithOut').innerHTML  = `Sin interacción: <span class="valorKPI">${usability.withOut}</span>`;
        document.body.querySelector('.diferenceUsability').innerHTML= `% Diferencia : ${usability.diference}%`;

        /** Imprimiendo la usabilidad Con y Sin interacción */
        document.body.querySelector('.engagementWith').innerHTML    = `Con interacción: <span class="valorKPI">${engagement.withFormat}</span>`;
        document.body.querySelector('.engagementWithOut').innerHTML = `Sin interacción: <span class="valorKPI">${engagement.withOutFormat}</span>`;
        document.body.querySelector('.diferenceEngagement').innerHTML= `% Diferencia : ${engagement.diference}%`;

        /** Impirmiendo el add To Car Con y Ain interacción */
        
        document.body.querySelector('.addToCarWith').innerHTML      = `Con interacción: <span class="valorKPI"> ${addToCar.numberSessionWI}(${addToCar.with}%)</span>`;
        document.body.querySelector('.addToCarWithOut').innerHTML   = `Sin interacción: <span class="valorKPI">${addToCar.numberSessionWIO}(${addToCar.withOut}%)</span>`;

       addToCar.withOut > 0 
       ?(document.body.querySelector('.diferenceAddToCar').innerHTML = `% Diferencia : ${addToCar.diference}%`)
       :(document.body.querySelector('.diferenceAddToCar').innerHTML = `% Diferencia : 0%`)

        /** Imprimiendo la conversión Con y Sin  interacción */
        document.body.querySelector('.purchaseWith').innerHTML      = `Con interacción: <span class="valorKPI">${purchase.numberTransactionsWI}(${(purchase.numberTransactionsWI/usability.with).toFixed(3)}%)</span>`;
        document.body.querySelector('.purchaseWithOut').innerHTML   = `Sin interacción: <span class="valorKPI">${purchase.numberTransactionsWIO}(${(purchase.numberTransactionsWIO/usability.withOut).toFixed(3)}%)</span>`;

        // Variables para obtener la diferencia a partir de la operación hecha en purchaseWith y purchaseWithOut
        const conInteraccion             = document.body.querySelector('.purchaseWith');
        const purchaseWithPercentage     = parseFloat(conInteraccion.querySelector('.valorKPI').textContent.match(/\((\d+\.\d+)\%\)/)[1]);
        const sinInteraccion             = document.body.querySelector('.purchaseWithOut');
        const purchaseWOIPercentage      = parseFloat(sinInteraccion.querySelector('.valorKPI').textContent.match(/\((\d+\.\d+)\%\)/)[1]);
        const diferencia                 = (purchaseWithPercentage / purchaseWOIPercentage *100).toFixed(0);
   
        purchaseWOIPercentage > 0 
        ?(document.body.querySelector('.diferencePurchase').innerHTML = `% Diferencia : ${diferencia}%`)
        : (document.body.querySelector('.diferencePurchase').innerHTML = `% Diferencia : 0%`)

        /** Renderizar la gráfica de usabilidad */
        graphicUsability(usability);

        /** Renderizar la gráfica de Engagement */
        graphicEngagement(engagement);

        /** Renderizar la gráfica de AddToCar */
        graphicAddToCar(addToCar);

        /** Renderizar la gráfica de Purchase */
        graphicPurchase(purchase);

    };
    
    /** Función para construir la gráfica de kpi por país */
    function buildGraphic(kpis) {
        kpiActual = kpis;
        let newArray = dataGeneralxsku;
        let elementToReturn = {
            months: [],
        };
    
        const createStructure = buildStructureToGraphics(arrayToGraphic);
    
        kpis.forEach(kpi => {
            elementToReturn[kpi] = {
                diferences: []
            };
        });
    
        let countryAdded = false;
    
        Object.entries(createStructure).forEach(([key, value]) => {
            elementToReturn.months.push(key);
            
            kpis.forEach(kpi => {
                switch (kpi) {
                    case 'usabilidad':
                        elementToReturn[kpi].diferences.push(buildUsability(value).diference);
                        break;
                    case 'añadir al carrito':
                        elementToReturn[kpi].diferences.push(buildAddToCar(value).diference);
                        break;
                    case 'conversion':
                            elementToReturn[kpi].diferences.push(buildPurchase(value).diference);
                        break;    
                    // Agrega más casos si hay más KPI
                }
            });
    
            // Añadir el país solo una vez
            if (!countryAdded) {
                elementToReturn.pais = buildUsability(value).paises;
                countryAdded = true;
            }
        });
        renderComparationGraphic(elementToReturn, kpis);
        return elementToReturn;
    }


    let arrayToGraphicUs = dataGeneralxsku
    function buildGraphicUsability(paises) {
        // Aquí 'paises' es una lista de nombres de países, por ejemplo: ['Chile', 'Argentina']
    console.log(paises);
        let elementToReturn = {
            months: [],
        };
    
        // Crear la estructura inicial para los países
        paises.forEach(pais => {
            elementToReturn[pais] = {
                differences: []
            };
        });
    
        // Agrupar los datos por mes
        const createStructure = buildStructureToGraphics(arrayToGraphicUs); // Esta función debe retornar una estructura agrupada por mes
    
        // Iterar sobre la estructura agrupada por mes
        Object.entries(createStructure).forEach(([month, data]) => {
            elementToReturn.months.push(month);
    
            // Iterar sobre los países para llenar los datos de diferencias
            paises.forEach(pais => {
                // Filtrar los datos para el país actual en el mes actual
                let countryData = data.filter(item => item.pais === pais);
    
                // Calcular la usabilidad del país para el mes actual
                if (countryData.length > 0) {
                    let usabilityData = buildUsabilityByCountry(countryData);
                    elementToReturn[pais].differences.push(usabilityData[pais].difference);
                } else {
                    // Si no hay datos para el país en este mes, agregar un valor por defecto, por ejemplo 0
                    elementToReturn[pais].differences.push(0);
                }
            });
        });
    
        // Llamar a la función para renderizar el gráfico
        renderComparationGraphicUsability(elementToReturn, paisActual)
        return elementToReturn
     
    }
    
        
    /** Función para construir la gráfica de kpi por país */
    function buildGraphicCategory(paises) {
        let elementToReturn = {
            months: [],
        };
        console.log(paises);
    
        // Crear la estructura inicial para los países
        paises.forEach(pais => {
            elementToReturn[pais] = {};
        });
    
        const createStructure = buildStructureToGraphics(arrayToGraphicUs); // Esta función debe retornar una estructura agrupada por mes
        const selectedCountry = document.querySelector('.selectCountry').value;
    
        // Iterar sobre la estructura agrupada por mes
        Object.entries(createStructure).forEach(([month, data]) => {
            let isValidMonth = false;
    
            // Iterar sobre los países para llenar los datos de diferencias por categoría
            paises.forEach(pais => {
                if (!elementToReturn[pais][month]) {
                    elementToReturn[pais][month] = {};
                }
    
                let countryData = data.filter(item => item.pais === pais && item.categoria !== "Null");
                if (countryData.length > 0) {
                    let usabilityData = buildUsabilityByCountryAndCategory(countryData);
                    // Iterar sobre las categorías actuales y agregar diferencias
                    Object.keys(usabilityData[pais]).forEach(category => {
                        if (usabilityData[pais] && usabilityData[pais][category]) {
                            let difference = usabilityData[pais][category].difference;
                            if (difference !== null && difference !== 'NaN' && difference !== '' && difference !== '0') {
                                elementToReturn[pais][month][category] = difference;
                                isValidMonth = true;
                            }
                        }
                    });
                }
            });
    
            // Solo agregar el mes si contiene al menos una categoría válida
            if (isValidMonth) {
                elementToReturn.months.push(month);
            } else {
                // Remover el mes de la estructura si no es válido
                paises.forEach(pais => {
                    delete elementToReturn[pais][month];
                });
            }
        });
    
        renderCategoryGraphicUsability(elementToReturn, selectedCountry);
        return elementToReturn;
    }
    
/** Eventos que actualiza la información */
document.body.querySelector('.selectCountry').addEventListener('input', () => {
    const selectedCountry = document.querySelector('.selectCountry').value;
    filterProcess();
    buildGraphic(kpiActual);
    renderCategoryGraphicUsability(selectedCountry);
    buildGraphicCategory(paisActualCat);
    console.log(selectedCountry);
}, false);

document.body.querySelector('.selectDate'    ).addEventListener('input', filterProcess , false);
document.body.querySelector('.selectCategory').addEventListener('change', filterProcess);
document.body.querySelector('.selectCategory').addEventListener('input', () => {filterProcess();}, false);

filterProcess();
buildGraphic(kpiActual);
buildGraphicUsability(paisActual);
buildGraphicCategory(paisActual);




