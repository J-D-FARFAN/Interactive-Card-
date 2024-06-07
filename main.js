    const elements = {
        submitForm: document.querySelector("#submit"),
        form: document.querySelector(".contentForm--infoCards"),
        success: document.querySelector(".contentSubmitState"),
        submitContinue: document.querySelector(".submitContinue"),
        nameInput: document.querySelector("#nameInput"),
        nameDisplay: document.querySelector(".nameUsuary"),
        nameMessage: document.querySelector(".nameMessage"),
        numberInput: document.getElementById("numberInput"),
        numberDisplay: document.getElementById("numberCard"),
        numberMessage: document.querySelector(".numberMessage"),
        monthInput: document.querySelector("#month"),
        monthDisplay: document.querySelector(".month"),
        monthMessage: document.querySelector(".monthMessage"),
        yearInput: document.querySelector("#year"),
        yearDisplay: document.querySelector(".year"),
        yearMessage: document.querySelector(".yearMessage"),
        cvcInput: document.querySelector("#cvc"),
        cvcDisplay: document.querySelector(".cvcCard"),
        cvcMessage: document.querySelector(".cvcMessage"),
        inputs: document.querySelectorAll(".stylesForInputs"),
        cache: document.querySelectorAll(".clearCache")
    };

    const defaultValues = {
        name: "JANE APPLESEED",
        number: "0000 0000 0000 0000",
        month: "00",
        year: "00",
        cvc: "000"
    };

    function resetCardFields() {
        Object.keys(elements).forEach(key => {
            if (key.endsWith("Input")) {
                const field = key.replace("Input", "");
                elements[key].value = defaultValues[field];
                elements[`${field}Display`].textContent = defaultValues[field];
                validateInput(elements[key], elements[`${field}Message`]);
            }
        });
    }

    function handleInput(inputElement, displayElement, defaultValue) {
        inputElement.addEventListener("input", function() {
            displayElement.textContent = this.value || defaultValue;
            validateInput(inputElement, elements[`${inputElement.id.replace("Input", "Message")}`]);
        });
    }

    function handleBlur(inputElement, messageElement) {
        inputElement.addEventListener("blur", function() {
            if (!this.value) {
                messageElement.style.display = "block";
                inputElement.style.borderColor = "hsl(0, 100%, 66%)";
            }
        });
    }

    function validateInput(inputElement, messageElement) {
        const fieldName = inputElement.id.replace("Input", ""); // Obtener el nombre del campo
        let value = inputElement.value.trim(); // Eliminar los espacios en blanco al inicio y al final
        let isValid = true;
        
        if (fieldName === 'name') {
            isValid = /^[a-zA-Z\s]*$/.test(value); // Validar solo texto para el campo de nombre
        } else if (fieldName === 'number') {
            // Remover espacios y validar solo números
            value = value.replace(/\s/g, '');
            isValid = /^\d*$/.test(value); // El número debe tener exactamente 16 dígitos
        } else {
            isValid = /^\d*$/.test(value); // Validar solo números para los otros campos
        }
        
        if (!value) {
            inputElement.style.borderColor = ""; // Eliminar el borde rojo si está vacío
            messageElement.style.display = "none"; // Ocultar el mensaje de error si está vacío
        } else if (!isValid) {
            inputElement.style.borderColor = "hsl(0, 100%, 66%)"; // Establecer el color del borde a rojo si no es válido
            messageElement.style.display = "block"; // Mostrar el mensaje de error si no es válido
        } else {
            inputElement.style.borderColor = ""; // Eliminar el borde rojo si el campo es válido
            messageElement.style.display = "none"; // Ocultar el mensaje de error si el campo es válido
        }
    }
    
    function validateAllInputs() {
        Object.keys(elements).forEach(key => {
            if (key.endsWith("Input")) {
                validateInput(elements[key], elements[`${key.replace("Input", "Message")}`]);
            }
        });
    }

    function isFormValid() {
        let isValid = true;
        Object.keys(elements).forEach(key => {
            if (key.endsWith("Input")) {
                const inputElement = elements[key];
                const messageElement = elements[`${key.replace("Input", "Message")}`];
                if (!inputElement.value || inputElement.style.borderColor === "hsl(0, 100%, 66%)") {
                    validateInput(inputElement, messageElement);
                    inputElement.style.borderColor = "hsl(0, 100%, 66%)";
                    messageElement.style.display = "block";
                    isValid = false;
                }
            }
        });
        if (!elements.nameInput.value || elements.nameInput.style.borderColor === "hsl(0, 100%, 66%)") {
            elements.nameInput.style.borderColor = "hsl(0, 100%, 66%)";
            elements.nameMessage.style.display = "block";
            isValid = false;
        }    
        return isValid;
    }

    elements.numberInput.addEventListener("input", function() {
        let unspacedNumber = this.value.replace(/\s/g, '');
        let formattedNumber = unspacedNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
        let position = this.selectionStart;
        this.value = formattedNumber;
        this.selectionStart = this.selectionEnd = position + (formattedNumber.slice(0, position).match(/\s/g) || []).length;
        elements.numberDisplay.textContent = formattedNumber || "0000 0000 0000 0000";
        validateInput(this, elements.numberMessage);
    });

    handleInput(elements.nameInput, elements.nameDisplay, "JANE APPLESEED");
    handleInput(elements.monthInput, elements.monthDisplay, "00");
    handleInput(elements.yearInput, elements.yearDisplay, "00");
    handleInput(elements.cvcInput, elements.cvcDisplay, "000");

    Object.keys(elements).forEach(key => {
        if (key.endsWith("Input")) {
            handleBlur(elements[key], elements[`${key.replace("Input", "Message")}`]);
        }
    });

    const inputsToValidate = ["numberInput", "monthInput", "yearInput", "cvcInput"];
    inputsToValidate.forEach(input => {
        elements[input].addEventListener("input", function() {
            validateInput(this, elements[`${input.replace("Input", "Message")}`]);
        });
    });

    elements.submitForm.addEventListener("click", function(event) {
        event.preventDefault();
        if (!isFormValid()) {
            return;
        }
        elements.form.style.display = "none";
        elements.success.style.display = "flex";
        elements.submitContinue.addEventListener("click", function() {
            resetCardFields();
            elements.inputs.forEach(input => {
                input.value = '';
            });
            elements.form.style.display = "block";
            elements.success.style.display = "none";
        });
    });
