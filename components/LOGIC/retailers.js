import retail from '../retail.js';
console.log(retail)

let 
retailers = new Set() ,
logosMarca = {
    Alkosto            : { name:"Alkosto         " , products : [] , urlMedia:'https://www.alkosto.com/medias/alkosto-logo.svg?context=bWFzdGVyfGltYWdlc3wxMjMxMnxpbWFnZS9zdmcreG1sfGFXMWhaMlZ6TDJnMllTOW9NMlV2T1RrNU1URXhNREEyTmpJd05pNXpkbWN8OGRhMGMwM2M1M2FmNjk1MTRhODkzZjQ3NmI4OTU2N2Y1MTg5NmJlYWUxMTU5Njc1NmVkZjgxYzRlY2M0YjQ0Yw' },
    Homecenter         : { name:"Homecenter      " , products : [] , urlMedia:'https://images.sodimac.com/v3/assets/blt2f8082df109cfbfb/blta7cc331692d297db/5f3d804090eeff71088399b1/Artboard_1.png?disable=upscale&format=webp&quality=70&width=1280' },
    
    Cencosud           : { name:"Cencosud        " , products : [] , urlMedia:'https://jumbocolombiaio.vtexassets.com/arquivos/logo-jumbo-2024.svg' },
    ElectroJaponesa    : { name:"Electro Japonesa" , products : [] , urlMedia:'https://electrojaponesa.vteximg.com.br/arquivos/logo-ej-2.png?v=637777868209870000' },
    Exito              : { name:"Exito           " , products : [] , urlMedia:'https://d1rnpo543m3vxh.cloudfront.net/content/setting-store/exitocol/fastStoreConfiguration/64-fileWidget-root_iconExito.svg?v=1712607924186' },
    GrupoMansión       : { name:"Grupo Mansión   " , products : [] , urlMedia:'https://www.grupomansion.com/img/mansion-electrodomesticos-logo-1661743228.jpg' },
    Olimpica           : { name:"Olimpica        " , products : [] , urlMedia:'https://upload.wikimedia.org/wikipedia/commons/4/4c/Olimpical.png' },
   
    Lagobo             : { name:"Lagobo          " , products : [] , urlMedia:'https://www.lagobo.com/wp-content/uploads/2017/12/logo-LAGOBO.png' },
    Metro              : { name:"Metro           " , products : [] , urlMedia:'https://metrocolombiaio.vtexassets.com/arquivos/logo-metro-2023.svg' },
    MuyBacano          : { name:"MuyBacano       " , products : [] , urlMedia: 'https://muybacano.vtexassets.com/assets/vtex.file-manager-graphql/images/1ea9e6b1-7211-4a64-bf37-044f06204984___97605d1e60181423a9bfa131d3b07687.png' },
    Olimpica           : { name:"Olimpica        " , products : [] , urlMedia:'https://upload.wikimedia.org/wikipedia/commons/4/4c/Olimpical.png' },
    Pepeganga          : { name:"Pepeganga       " , products : [] , urlMedia:'https://pepeganga.vtexassets.com/assets/vtex.file-manager-graphql/images/b49c4ce8-3145-4a67-8a83-15730c984d01___f3be2873ec452b1351ce8289bc00b7c2.svg' },
}

/** Tomamos todas los retailers */
retail.map( registry =>  retailers.add(registry.retail) );

/** Segmentamos por retailer */
retail.map( registry =>logosMarca[ registry.retail.replace(' ','') ].products.push(registry) );

let fragment = document.createDocumentFragment();

const makeAPopUpList = retailName =>{

    if(logosMarca.hasOwnProperty(retailName.trim())){
        const nombre = logosMarca[retailName.trim()];
        console.log(nombre)
    }else{
        console.log('some happen')
    }

    const popup = document.createElement('DIV');
    popup.classList.add('modalListProduct')
    popup.innerHTML=`
        <h3 class="closePopUp">X</h3>
        <div class="containerInfoList">
            <img src="${logosMarca[retailName.trim()].urlMedia || 'null'}">
            <h2 class="totalListProduct">Total de productos :${logosMarca[retailName.trim()].products.length}</h2>
        </div>
        <div class="containerProducts">
            <div class="titleProductList">
                <p class="productNameList">Nombre Producto<p>
                <p class="productNameList2">Estado del producto<p>
            </div>
            <div class="listPrincipalProducts"></div>
        </div>
    `;

    let fragmentListProduct = document.createDocumentFragment();

    logosMarca[retailName.trim()].products.map(registry=>{
        
        const div = document.createElement('DIV');
        div.classList.add('listProductCotainerModal');
        div.innerHTML=`
            <p class="modalNameProduct" title="${registry.EAN}"> ${registry.nameProduct} </p>
            <p 
            class="modalStatusProduct ${registry.productStatus == 4 ? 'publish' : 'pause'}" 
            title="${registry.productStatus == 4 ? 'Publish' : 'In Pause'}"> ${registry.productStatus == 4 ? 'publicado' : 'en pausa'}</p>
        `;

        fragment.appendChild(div)
    })

    popup.querySelector('.listPrincipalProducts').appendChild(fragment)

    document.body.appendChild(popup);

    popup.querySelector('.closePopUp').addEventListener('click',()=>{
        document.body.querySelector('.modalListProduct').remove();
    })
}

const markeACard = retail =>{

    const 
    div = document.createElement('DIV');
    div.classList.add('containerCardRetailer');
    div.setAttribute('Retail', retail.name);
    div.innerHTML= `
        <div class="logoRetail" style="background-image:url('${retail.urlMedia}')" title="${retail.name}"></div>
        <div class="containerCardRetail">
            <p class="paragraphRetail" title="Total: ${retail.products.length}"> Total de productos: <span class="valueretailers">${retail.products.length}</span></p>
            <p class="paragraphRetail" title="Prendido: ${retail.products[0].creationDate}"> Prendido desde:<br><span class="valueretailers">${retail.products[0].creationDate}</span> </p>
        </div>
        <button class="productListbutton" nameRetail="${retail.name}">Ver listado de productos</button>
    `;

    div.querySelector('.productListbutton').addEventListener('click',(e)=>{
        makeAPopUpList(e.target.attributes[1].value.replace(' ','').trim())
    })

    fragment.appendChild(div);
}

Object.entries(logosMarca).forEach( ([key,value])=>{
    markeACard(value);
    document.body.querySelector('.mainClass').appendChild(fragment)
});

