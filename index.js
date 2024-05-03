import dataGeneralxsku from "./components/dataGeneralsku.js";

let filters = null;

/** ----------------- Acutalización de valores DOM ------------- */

    /** Creación <option> Seleccione </option> */
    function createOptionDefault() {
        const option = document.createElement("OPTION")
        option.value = null;
        option.innerHTML = "Seleccione";
        return option
    };

    /** Actualización de filtros. */
    function updateFiltersDom() {

        filters = {
            pais: document.body.querySelector(".selectCountry").value,
            categoria: document.body.querySelector(".selectCategory").value,
            mes: document.body.querySelector(".selectDate").value,
            //accion: document.body.querySelector(".selectAction").value,
            sku: document.body.querySelector(".selectSku").value
        }

    };

    /** Filtro por Pais */
    function filterCountry() {

        let registryFilter = [];
        updateFiltersDom();

        dataGeneralxsku.map( registry => registry.pais == filters.pais && registryFilter.push(registry) )

        if (registryFilter.length > 0)  return registryFilter
        else                            return dataGeneralxsku;

    };

    /** Filtro por Categoría */
    function filterCategory(array) {

        /** Limpiamos el filtro de categorias */
        document.body.querySelector(".selectCategory").innerHTML = "";

        let 
        registryFilter  = [],
        domCategory     = [],
        fragment        = document.createDocumentFragment();

        array.forEach(element => {
            let listCategory = domCategory.find(e => element.categoria == e) 
            !listCategory && domCategory.push(element.categoria)
        });

        domCategory.forEach(element => {
            const option = document.createElement("OPTION")
            option.value = element;
            option.innerHTML = element;
            fragment.appendChild(option)
        })

        array.map(registry => {
            registry.categoria == filters.categoria && registryFilter.push(registry)
        })

        document.body.querySelector(".selectCategory").appendChild(createOptionDefault())
        document.body.querySelector(".selectCategory").appendChild(fragment)

        if (registryFilter.length > 0) {
            return registryFilter
        } else {
            return array
        }
    };

    /** Filtro Fechas */
    function filterDate(array) {

        document.body.querySelector(".selectDate").innerHTML = "";

        let 
        registryFilter      = [],
        domDate             = [],
        fragment            = document.createDocumentFragment()

        array.forEach(element => {
            let listDate = domDate.find(e => element.Mes == e) 
            !listDate && (domDate.push(element.Mes))
        });

        domDate.forEach(element => {
            const option = document.createElement("OPTION")
            option.value = element;
            option.innerHTML = element;
            fragment.appendChild(option)
        });

        array.map(registry => registry.mes == filters.mes && registryFilter.push(registry) );

        document.body.querySelector(".selectDate").appendChild(createOptionDefault());
        document.body.querySelector(".selectDate").appendChild(fragment);

        if (registryFilter.length > 0)  return registryFilter
        else                            return array;    

    };

    /** Actualización de valores del filtro */
    function updateFilters() {
        let country         = filterCountry();
        let category        = filterCategory(country);
        let date            = filterDate(category);
        updateDataGeneral(date)
    };

/** ------------- Actualización Tabla general ------------- */

    function updateDataGeneral( array ) {
        /** Actualización de la primera tabla */
        updateTable(array);
        /** Actualización de la data de las graficas  */
        dataSesionToGraphic(array)
    };

        /** Actualización de las sesiones en la tabla */
        function updateSessions(array) {

            let sessions = {
                with: 0,
                without: 0
            }

            array.forEach(element => {

                let valuewith       = element.conInteraccion;
                let valuewithout    = element.sinInteraccion;

                if (typeof(valuewith) == "string") {
                    if (valuewith.includes(","))(valuewith = element.conInteraccion.replace(",", ""))
                };

                if (typeof(valuewithout) == "string") {
                    if (valuewithout.includes(","))(valuewithout = element.sinInteraccion.replace(",", ""))
                };

                sessions.with           += parseInt(valuewith);
                sessions.without        += parseInt(valuewithout);

            })

            document.body.querySelector('.WISesion').innerHTML= sessions.with
            document.body.querySelector('.WOISesion').innerHTML= sessions.without
        };

        /** Actualización de los registros con addTocar en la tabla */
        function updateAddtocart(array){
            let size = array.length
            let addTocart = {
                with: 0,
                without: 0
            }

            array.forEach(element => {    
                addTocart.with += parseInt(element.AddToCartConInteraccion);
                addTocart.without += parseInt(element.AddToCartSinInteraccion);
                
            })

            document.body.querySelector('.WIAddToCar').innerHTML= (addTocart.with/size).toFixed(2)
            document.body.querySelector('.WOIAddToCar').innerHTML= (addTocart.without/size).toFixed(2)

        };

        /** Actualización de registros con Purchase en la tabla */
        function updatePurchase(array){
            let size = array.length
            let purchase = {
                with: 0,
                without: 0
            }

            array.forEach(element => {    
                purchase.with += element.TransaccionesConInteraccion;
                purchase.without += element.TransaccionesSinInteraccion;
                
            })
            document.body.querySelector('.WIPurchase').innerHTML= (purchase.with/size).toFixed(3)
            document.body.querySelector('.WOIPurchase').innerHTML= (purchase.without/size).toFixed(3)

        };

        /** Actaulización de registros de engagement en la tabla  */
        function updateEngagement(array){

            let 
            size        = array.length;

            let 
            Wtotal      = 0, 
            WOtotal     = 0;

            let 
            Whours      = 0,
            Wminutes    = 0,
            Wsec        = 0;

            let 
            WOhours     = 0,
            WOminutes   = 0,
            WOsec       = 0;

            array.map((registry)=>{

                let WregistryHour, WregistryMinute,WregistrySec;
                let WOregistryHour, WOregistryMinute,WOregistrySec;

                WregistryHour    =  parseInt(registry.tiempoConInteraccion.split(":")[0]);
                WregistryMinute  =  parseInt(registry.tiempoConInteraccion.split(":")[1]);
                WregistrySec     =  parseInt(registry.tiempoConInteraccion.split(":")[2]);

                WOregistryHour    =  parseInt(registry.tiempoSinInteraccion.split(":")[0]);
                WOregistryMinute  =  parseInt(registry.tiempoSinInteraccion.split(":")[1]);
                WOregistrySec     =  parseInt(registry.tiempoSinInteraccion.split(":")[2]);

                Whours   += WregistryHour*60*60;
                Wminutes += WregistryMinute*60;
                Wsec     += WregistrySec;

                WOhours   += WOregistryHour*60*60;
                WOminutes += WOregistryMinute*60;
                WOsec     += WOregistrySec;
                
            })

            Wtotal = Math.ceil((Whours + Wminutes + Wsec) / size)
            WOtotal = Math.ceil((WOhours + WOminutes + WOsec) / size)
            document.body.querySelector('.WIDuration').innerHTML=`${parseInt(Wtotal/60)} : ${parseInt(Wtotal%60)}`;
            document.body.querySelector('.WOIDuration').innerHTML=`${parseInt(WOtotal/60)} : ${parseInt(WOtotal%60)}`;
        
        };

        /** Actualización de diferencias en la tabla */
        function totalDiference(){

            let 
            sesionWI        = parseInt(document.body.querySelector('.WISesion').innerHTML),
            sesionWOI       = parseInt(document.body.querySelector('.WOISesion').innerHTML),
            durationWI      = document.body.querySelector('.WIDuration').innerHTML.split(':'),
            durationWOI     = document.body.querySelector('.WOIDuration').innerHTML.split(':'),
            addTocartWI     = parseFloat(document.body.querySelector('.WIAddToCar').innerHTML),
            addTocartWOI    = parseFloat(document.body.querySelector('.WOIAddToCar').innerHTML),
            purchaseWI      = parseFloat(document.body.querySelector('.WIPurchase').innerHTML),
            purchaseWOI     = parseFloat(document.body.querySelector('.WOIPurchase').innerHTML);


            let calculateSesion   = sesionWI / (sesionWOI + sesionWI)
            let calculateAddtocar = addTocartWI / addTocartWOI
            let calculatePurchase = purchaseWI / purchaseWOI

            let minutesToSecWi, secToSecWi, minutesToSecWOI, secToSecWOI, totalDurationWI, totalDurationWOI;

            minutesToSecWi      = parseInt(durationWI[0]*60)
            minutesToSecWOI     = parseInt(durationWOI[0]*60)
            secToSecWi          = parseInt(durationWI[1])
            secToSecWOI         = parseInt(durationWOI[1])

            totalDurationWI = minutesToSecWi + secToSecWi;
            totalDurationWOI = minutesToSecWOI + secToSecWOI;
        
            document.body.querySelector('.DPSesion').innerHTML      = (calculateSesion*100).toFixed(0)+'%'
            document.body.querySelector('.DPDuration').innerHTML    = ((totalDurationWI / totalDurationWOI)*100).toFixed(0) + "%"
            document.body.querySelector('.DPAddToCar').innerHTML    = (calculateAddtocar*100).toFixed(0)+'%'
            document.body.querySelector('.DPPurchase').innerHTML    = (calculatePurchase*100).toFixed(0)+'%'

        };

        /** Actualización de la tabla General */
        function updateTable(array){
            updateSessions(array)
            updateEngagement(array)
            updateAddtocart(array)
            updatePurchase(array)
            totalDiference()
        };


/** Actualización de la data Para las gráficas */

    let monthListGraphicSSession = [] , diferenceSesiongraphic = []

    function dataSesionToGraphic(array){

        let arrayMonth          = [];
        let segmentregistry     = {};
        let valuesSesion        = [];

        /** Desfragmentación */
        let months = (array) =>{
            array.map( registry => {
                if( arrayMonth.length == 0 ) { 
                    arrayMonth.push(registry.Mes) ; 
                    segmentregistry[registry.Mes] ? segmentregistry[registry.Mes].push(registry) : (
                        segmentregistry[registry.Mes]=[],
                        segmentregistry[registry.Mes].push(registry)
                    )
                }

                else{ 
                    const 
                    verifyMonthArray = arrayMonth.find( registryMonth => registry.Mes == registryMonth )
                    verifyMonthArray ? false : arrayMonth.push(registry.Mes) ;
                    segmentregistry[registry.Mes] ? segmentregistry[registry.Mes].push(registry) : (
                        segmentregistry[registry.Mes]=[],
                        segmentregistry[registry.Mes].push(registry)
                    )
                }
            });
        };

        months(array);

        for(let i = 0; i < arrayMonth.length; i++){
            valuesSesion.push(diferenceSessionGraphic(segmentregistry))
        }        

    };

    function diferenceSessionGraphic(array){

        let listMonth   = [];
        let arrayToWork = [];
        let listValues  = [];

        let sessions = {
            with: 0,
            without: 0
        };


        Object.keys(array).forEach( registry => listMonth.push(registry) )
        Object.entries(array).forEach( registry => arrayToWork.push(registry[1]) )

        arrayToWork.forEach( (registryPrincipal,index) =>{

            registryPrincipal.forEach( registry => {                

                let _with, _without;

                _with = parseInt(registry.conInteraccion);
                if( typeof(registry.sinInteraccion) == 'string'){
                    _without = parseFloat( registry.sinInteraccion.replace(',','.') )
                    console.log(_without)
                }

         
                sessions.with     += _with;
                sessions.without  += _without;
            })

            console.log(sessions)
            sessions.with=0
            sessions.without=0
        })


    };













/** ------------------- GRAPHICS -------------------------- */
let 
months = document.body.querySelector('.selectDate').children,
monthsList = [];

function updateGraphic(){

    for(let i = 0; i< months.length;i++){
        months[i].value !== "null" && monthsList.push(months[i].innerHTML)
    };


    const ctx = document.body.querySelector('#myChart');

    new Chart(ctx, {
    type: 'bar',
    data: {
        labels: monthsList,
        datasets: [{
        label:"Usabilidad",
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
        }]
    },
    options: {
        scales: {
        y: {
            beginAtZero: true
        }
        }
    }
    });
}

function updateGraphicSesion(month){

}

document.body.querySelector('.kpiSelect').addEventListener('input',(e)=>{
    let event = e.target.value
    
    switch(event){
        case "Sesiones":
            updateGraphic()
            break;
        case "Duración":
            break;
        case "Añadir al carrito":
            break;
        case "Transacciones":
        break;
    }
},false)




document.body.querySelector(".selectCountry").addEventListener("input", updateFilters, false)
document.body.querySelector(".selectCategory").addEventListener("input", updateFilters, false)
document.body.querySelector(".selectDate").addEventListener("input", updateFilters, false)
//document.body.querySelector(".selectAction").addEventListener("input", updateFilters, false)
document.body.querySelector(".selectSku").addEventListener("input", updateFilters, false)