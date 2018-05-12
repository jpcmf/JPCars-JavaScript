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

    console.log(
      $carImage,
      $carBrand,
      $carYear,
      $carPlate,
      $carColor,
      $tableCarList,
      $formRegister,
      $btnRegister,
      $companyName,
      $companyPhone
    );

    return {
      init: function init() {
        this.initEvents();
        this.companyInfo();
        this.carsGetInfo();

        this.validateForm();
        this.carsDelInfo();
      },

      initEvents: function initEvents() {
        $('[data-js="form-register"]').on('submit', this.handleSubmit, false);
        // const picker = datepicker(document.querySelector('[data-js="year"]'), {dateSelected: new Date(2099, 0, 5)});
      },

      handleSubmit: function handleSubmit(e) {
        e.preventDefault();
        $tableCarList.get().appendChild(app.createNewCar());

        app.carsPostInfo();
        app.handleRemove();

        $formRegister.get().reset();
        $btnRegister.get().disabled = true;
      },

      handleRemove: function handleRemove() {
        var $tdAdd = document.querySelectorAll('table > tbody > tr > td:last-child > a');

        $tdAdd.forEach(function(item) {
          item.addEventListener('click',function(e) {
            e.preventDefault();
            var newTr = this.parentNode.parentNode;
            newTr.remove();
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

        $inputYear.addEventListener('keyup', function(e) {
          // this.value = this.value.toString().replace(/[^\d]/g,'');
          e.target.value = e.target.value.toString().replace(/[^\d]{4}/g,'');
        }, false);
      },

      createNewCar: function createNewCar() {
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
        $tdBrand.textContent = $('[data-js="brand-model"]').get().value;
        $tdYear.textContent = $('[data-js="year"]').get().value;
        $tdPlate.textContent = $('[data-js="plate"]').get().value;
        $tdColor.textContent = $('[data-js="color"]').get().value;

        $btnRemove.setAttribute('data-js', 'remove');
        $btnRemove.setAttribute('class', 'form-register__remove');
        $btnRemove.setAttribute('href', '#');
        $btnRemove.innerHTML = 'excluir';
        $tdRemove.appendChild($btnRemove);

        $tr.setAttribute('data-js', 'car-add');
        $tr.appendChild($tdImage);
        $tr.appendChild($tdBrand);
        $tr.appendChild($tdYear);
        $tr.appendChild($tdPlate);
        $tr.appendChild($tdColor);
        $tr.appendChild($tdRemove);

        return $fragment.appendChild($tr);
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
          // console.log(data, this.status);
          for(var i = 0; i < data.length; i++) {
            // console.log(data[i]);

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

            $image.src = data[i].image;
            $tdImage.appendChild($image).classList.add('image');
            $tdBrand.textContent = data[i].brandModel;
            $tdYear.textContent = data[i].year;
            $tdPlate.textContent = data[i].plate;
            $tdColor.textContent = data[i].color;

            $btnRemove.setAttribute('data-js', 'remove');
            $btnRemove.setAttribute('class', 'form-register__remove');
            $btnRemove.setAttribute('href', '#');
            $btnRemove.innerHTML = 'excluir';
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
          }
          app.handleRemove();
        }
      },

      carsPostInfo: function carsPostInfo() {
        // console.log('cars post info');
        const params = {
          image: document.querySelector('[data-js="image"]').value,
          brandModel: document.querySelector('[data-js="brand-model"]').value,
          year: document.querySelector('[data-js="year"]').value,
          plate: document.querySelector('[data-js="plate"]').value,
          color: document.querySelector('[data-js="color"]').value
        }

        var ajax = new XMLHttpRequest();
        ajax.open('POST', API_CARS);
        ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        // ajax.send('image=http://www.google.com&brandModel=AudiA5&year=2018&plate=XXX-0000&color=branco');
        ajax.send('image=' + params.image + '&brandModel=' + params.brandModel + '&year=' + params.year + '&plate=' + params.plate + '&color=' + params.color);
        ajax.addEventListener('readystatechange', this.postCarsInfo, false);
      },

      postCarsInfo: function postCarsInfo() {
        if(this.readyState === 4) {
          var data = this.responseText;
          // console.log(data, this.status);
        }
      },

      carsDelInfo: function carsDelInfo() {
        var savedCars = [];
        var $newTr = document.querySelectorAll('[data-js="car-add"]');
        // console.log($newTr);

        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', API_CARS);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(null);
        xhr.addEventListener('readystatechange', this.delCarsInfo, false);
      },

      delCarsInfo: function delCarsInfo() {
        if (this.readyState === 4) {
          var data = JSON.parse(this.responseText);
          // console.log('data: ' + data);
        }
      }
    };
  })();

  app.init();

})(window.DOM);
