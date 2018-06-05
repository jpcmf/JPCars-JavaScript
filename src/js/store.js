;(function($) {
  'use strict';

  var app = (function appController() {

    var API_CARS = 'http://localhost:3000/car';
    var $carImage = $('[data-js="image"]');
    var $carBrand = $('[data-js="brand-model"]');
    var $carYear = $('[data-js="year"]');
    var $carPlate = $('[data-js="plate"]');
    var $carColor = $('[data-js="color"]');
    var $tableCarList = $('[data-js="table-car"]');
    var $formRegister = $('[data-js="form-register"]');
    var $btnRegister = $('[data-js="btnRegister"]');
    var $companyName = $('[data-js="company-name"]');
    var $companyPhone = $('[data-js="company-phone"]');

    return {
      init: function init() {
        this.initEvents();
        this.companyInfo();
        this.carsGetInfo();
        this.validateForm();
      },

      initEvents: function initEvents() {
        $('[data-js="form-register"]').on('submit', this.handleSubmit, false);
      },

      companyInfo: function companyInfo() {
        // console.log('company info');
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

      handleSubmit: function handleSubmit(e) {
        e.preventDefault();

        let data = {
          image: $('[data-js="image"]').get().value,
          brandModel: $('[data-js="brand-model"]').get().value,
          year: $('[data-js="year"]').get().value,
          plate: $('[data-js="plate"]').get().value,
          color: $('[data-js="color"]').get().value
        }

        $tableCarList.get().appendChild(app.constructTr(data));

        app.carsPostInfo(data);
        app.handleRemove();

        $formRegister.get().reset();
        $btnRegister.get().disabled = true;
      },

      handleRemove: function handleRemove() {
        var $tdAdd = document.querySelectorAll('[data-js="remove"]');

        $tdAdd.forEach(function(item) {
          item.addEventListener('click',function(e) {
            e.preventDefault();
            let plate = e.target.getAttribute('data-plate');
            console.log(plate);
            let newTr = document.querySelector('[data-tr="' + plate + '"]');
            console.log(newTr);
            if (newTr) newTr.remove();
            app.carsDelInfo(plate);
          }, false);
        });
      },

      validateForm: function validateForm() {
        var $inputs = document.querySelectorAll('input');
        var $inputYear = document.querySelector('[data-js="year"]');

        $formRegister.forEach(function($inputs) {
          $inputs.addEventListener('input', function(e) {
            if (!$inputs[0].value == '' && !$inputs[1].value == '' && !$inputs[2].value == '' && !$inputs[3].value == '' && !$inputs[4].value == '') {
              // $inputs = e.target.value.length == 0 ? $btnRegister.disabled = true : $btnRegister.disabled = false;
              $btnRegister.get().disabled = false;
            } else {
              $btnRegister.get().disabled = true;
            }
          }, false);
        });

        // $inputYear.addEventListener('keyup', function(e) {
        //   // this.value = this.value.toString().replace(/[^\d]/g,'');
        //   // e.target.value = e.target.value.toString().replace(/[^\d]{4}/g,'');
        // }, false);
      },

      constructTr: function constructTr(data) {
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

        $btnRemove.setAttribute('data-plate', data.plate);
        $btnRemove.setAttribute('data-js', 'remove');
        $btnRemove.setAttribute('class', 'form-register__remove');
        $btnRemove.setAttribute('href', '#');
        $btnRemove.innerHTML = 'excluir';
        $tdRemove.appendChild($btnRemove);

        $tr.setAttribute('data-tr', data.plate);
        $tr.appendChild($tdImage);
        $tr.appendChild($tdBrand);
        $tr.appendChild($tdYear);
        $tr.appendChild($tdPlate);
        $tr.appendChild($tdColor);
        $tr.appendChild($tdRemove);

        return $fragment.appendChild($tr);
      },

      carsGetInfo: function carsGetInfo() {
        // console.log('cars get info');
        var ajax = new XMLHttpRequest();
        ajax.open('GET', API_CARS);
        ajax.send();
        ajax.addEventListener('readystatechange', this.getCarsInfo, false);
      },

      getCarsInfo: function getCarsInfo() {
        if(this.readyState === 4) {
          var data = JSON.parse(this.responseText);
          // console.log('get: ' + data, this.status);
          for(var i = 0; i < data.length; i++) {
            var $tableCar = $('[data-js="table-car"]').get();
            var $tr = app.constructTr(data[i]);
            $tableCar.appendChild($tr);
          }
          app.handleRemove();
        }
      },

      carsPostInfo: function carsPostInfo(data) {
        // console.log('cars post info');

        // let data = {
        //   image: $('[data-js="image"]').get().value,
        //   brandModel: $('[data-js="brand-model"]').get().value,
        //   year: $('[data-js="year"]').get().value,
        //   plate: $('[data-js="plate"]').get().value,
        //   color: $('[data-js="color"]').get().value
        // }

        var ajax = new XMLHttpRequest();
        ajax.open('POST', API_CARS);
        ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        ajax.send('image=' + data.image + '&brandModel=' + data.brandModel + '&year=' + data.year + '&plate=' + data.plate + '&color=' + data.color);
        ajax.addEventListener('readystatechange', this.postCarsInfo, false);
      },

      postCarsInfo: function postCarsInfo() {
        if(this.readyState === 4) {
          var data = this.responseText;
          console.log('post: ' + data, this.status);
        }
      },

      carsDelInfo: function carsDelInfo(plate) {
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', API_CARS);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('plate=' + plate);
        xhr.addEventListener('readystatechange', this.delCarsInfo, false);
      },

      delCarsInfo: function delCarsInfo() {
        if (this.readyState === 4) {
          var data = this.responseText;
          console.log('delete: ' + data, this.status);
        }
      }
    };
  })();

  app.init();

})(window.DOM);
