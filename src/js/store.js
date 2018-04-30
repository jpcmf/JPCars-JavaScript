;(function($) {
  'use strict';

  var app = (function appController() {

    return {
      init: function init() {
        console.log('app init');
        this.companyInfo();
        this.initEvents();
        this.validateForm();
        this.carsGetInfo();
      },

      initEvents: function initEvents() {
        $('[data-js="form-register"]').on('submit', this.handleSubmit, false);
      },

      handleSubmit: function handleSubmit(e) {
        e.preventDefault();
        console.log('submit');

        var $tableCar = $('[data-js="table-car"]').get();
        $tableCar.appendChild(app.createNewCar());

        app.handleRemove();

        $('[data-js="form-register"]').get().reset();

      },

      handleRemove: function handleRemove(e) {
        // var url = 'http://localhost:3000/car';
        // var xhr = new XMLHttpRequest();
        // xhr.open('DELETE', url);
        // xhr.onload = function() {
        //   var cars = xhr.responseText;
        //   console.log(cars);
        // }
        // xhr.send(null);

        var $btnRemove = document.querySelector('[data-js="remove"]');
        var $trAdd = document.querySelectorAll('[data-js="car-add"]');

        $trAdd.forEach(function($btnRemove) {
          $btnRemove.addEventListener('click',function(e) {
            e.preventDefault();
            e.target.parentNode.parentNode.remove();
          }, false);
        });
      },

      validateForm: function validateForm() {
        var $btnRegister = document.querySelector('[data-js="btnRegister"]');
        var $inputImage = document.querySelector('[data-js="image"]');
        var $inputs = document.querySelectorAll('input');

        $inputs.forEach(function(inputField) {
          inputField.addEventListener('input', function(e) {
            inputField = e.target.value.length == 0 ? $btnRegister.disabled = true : $btnRegister.disabled = false;
          }, false);
        });

        // $inputImage.oninvalid = function(e) {
        //   e.target.setCustomValidity('URL should only contain images. e.g http://www.exemple.com/image.jpg|png|gif')
        // }
      },

      // createHTMLElements: function createHTMLElements() {
      //   var $fragment = document.createDocumentFragment();
      //   var $tr = document.createElement('tr');
      //   var $tdImage = document.createElement('td');
      //   var $image = document.createElement('img');
      //   var $tdBrand = document.createElement('td');
      //   var $tdYear = document.createElement('td');
      //   var $tdPlate = document.createElement('td');
      //   var $tdColor = document.createElement('td');
      //   var $tdRemove = document.createElement('td');
      //   var $btnRemove = document.createElement('a');
      // },

      createNewCar: function createNewCar() {

        // app.createHTMLElements();

        var $fragment = document.createDocumentFragment();
        var $tr = document.createElement('tr');
        var $tdImage = document.createElement('td');
        var $image = document.createElement('img');
        var $tdBrand = document.createElement('td');
        var $tdYear = document.createElement('td');
        var $tdPlate = document.createElement('td');
        var $tdColor = document.createElement('td');
        var $tdRemove = document.createElement('td');
        var $btnRemove = document.createElement('a');

        $image.src = $('[data-js="image"]').get().value;
        $tdImage.appendChild($image).classList.add('image');
        // $tdImage.textContent = $('[data-js="image"]').get().value;
        $tdBrand.textContent = $('[data-js="brand-model"]').get().value;
        $tdYear.textContent = $('[data-js="year"]').get().value;
        $tdPlate.textContent = $('[data-js="plate"]').get().value;
        $tdColor.textContent = $('[data-js="color"]').get().value;
        $btnRemove.setAttribute('data-js', 'remove');
        $btnRemove.setAttribute('class', 'btn-remove');
        $btnRemove.setAttribute('href', '#');
        $btnRemove.innerHTML = 'Remove';
        $tdRemove.appendChild($btnRemove);

        $tr.setAttribute('data-js', 'car-add');
        $tr.appendChild($tdImage);
        $tr.appendChild($tdBrand);
        $tr.appendChild($tdYear);
        $tr.appendChild($tdPlate);
        $tr.appendChild($tdColor);
        $tr.appendChild($tdRemove);

        app.carsPostInfo();

        return $fragment.appendChild($tr);
      },

      companyInfo: function companyInfo() {
        console.log('company info');
        var ajax = new XMLHttpRequest();
        ajax.open('GET', '/company.json', true);
        ajax.send();
        ajax.addEventListener('readystatechange', this.getCompanyInfo, false);
      },

      getCompanyInfo: function getCompanyInfo() {
        if(!app.isRequestOk.call(this)) {
          return;
        }
        var data = JSON.parse(this.responseText);
        var $companyName = $('[data-js="company-name"]').get();
        var $companyPhone = $('[data-js="company-phone"]').get();
        $companyName.textContent = data.name;
        $companyPhone.textContent = data.phone;
      },

      isRequestOk: function isRequestOk() {
        return this.readyState === 4 && this.status === 200;
      },

      carsGetInfo: function carsGetInfo() {
        console.log('cars get info');

        var ajax = new XMLHttpRequest();
        ajax.open('GET', 'http://localhost:3000/car');
        ajax.send();

        ajax.addEventListener('readystatechange', this.getCarsInfo, false);
      },

      getCarsInfo: function getCarsInfo() {
        if(this.readyState === 4) {
          var data = JSON.parse(this.responseText);
          console.log(data, this.status);

          data.forEach(function() {
            var $fragment = document.createDocumentFragment();
            var $tr = document.createElement('tr');
            var $tdImage = document.createElement('td');
            var $image = document.createElement('img');
            var $tdBrand = document.createElement('td');
            var $tdYear = document.createElement('td');
            var $tdPlate = document.createElement('td');
            var $tdColor = document.createElement('td');
            var $tdRemove = document.createElement('td');
            var $btnRemove = document.createElement('a');

            $image.src = data.image;
            $tdImage.appendChild($image).classList.add('image');
            $tdBrand.textContent = data.brandModel;
            $tdYear.textContent = data.year;
            $tdPlate.textContent = data.plate;
            $tdColor.textContent = data.color;
            $btnRemove.setAttribute('data-js', 'remove');
            $btnRemove.setAttribute('class', 'btn-remove');
            $btnRemove.setAttribute('href', '#');
            $btnRemove.innerHTML = 'Remove';
            $tdRemove.appendChild($btnRemove);

            $tr.setAttribute('data-js', 'car-add');
            $tr.appendChild($tdImage);
            $tr.appendChild($tdBrand);
            $tr.appendChild($tdYear);
            $tr.appendChild($tdPlate);
            $tr.appendChild($tdColor);
            $tr.appendChild($tdRemove);

            var $tableCar = $('[data-js="table-car"]').get();
            $tableCar.appendChild($fragment.appendChild($tr));

            app.handleRemove();
          });
        }
      },

      carsPostInfo: function carsPostInfo($tdImage, $tdBrand, $tdYear, $tdPlate, $tdColor) {
        console.log('cars post info');

        var ajax = new XMLHttpRequest();
        ajax.open('POST', 'http://localhost:3000/car');
        ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        // ajax.send('image=http://www.google.com&brandModel=AudiA3&year=2018&place=XXX-0000&color=branco');
        ajax.send('image=' + $tdImage + '&brandModel=' + $tdBrand + '&year=' + $tdYear + '&plate=' + $tdPlate + '&color=' + $tdColor);

        ajax.addEventListener('readystatechange', this.postCarsInfo, false);
      },

      postCarsInfo: function postCarsInfo() {
        if(this.readyState === 4) {
          var data = this.responseText;
          console.log(data, this.status);
        }
      }
    };
  })();

  app.init();

})(window.DOM);
