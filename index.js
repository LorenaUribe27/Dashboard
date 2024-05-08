let 
btnGenetal      = document.body.querySelector('.iconGeneral'),
btnRetailers    = document.body.querySelector('.iconRetailers'),
btnMultiCountry = document.body.querySelector('.iconCountry'),
iframeContent   = document.body.querySelector('.conteintPrincipalIframe')

btnGenetal.addEventListener('click',()=>{
    document.body.querySelector('.retailerContainerMenu').style.opacity=0;
    iframeContent.src="./components/HTML/general.html";
    btnGenetal.classList.add('iconSelect');
    btnRetailers.classList.remove('iconSelect');   
    btnMultiCountry.classList.remove('iconSelect');
});

btnRetailers.addEventListener('click',()=>{
    document.body.querySelector('.retailerContainerMenu').style.opacity=1;
    document.body.querySelector('.logoRetailMenu').src="";
    document.body.querySelector('.logoRetailMenu').innerHTML="";
    iframeContent.src="./components/HTML/retailers.html";
    btnRetailers.classList.add('iconSelect');
    btnMultiCountry.classList.remove('iconSelect');
    btnGenetal.classList.remove('iconSelect'); 
});

btnMultiCountry.addEventListener('click',()=>{
    document.body.querySelector('.retailerContainerMenu').style.opacity=0;
    iframeContent.src="./components/HTML/countryComparation.html";
    btnMultiCountry.classList.add('iconSelect');
    btnRetailers.classList.remove('iconSelect');  
    btnGenetal.classList.remove('iconSelect'); 
});