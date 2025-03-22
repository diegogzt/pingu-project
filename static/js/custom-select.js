document.addEventListener('DOMContentLoaded', function() {
    // Find the original select
    const originalSelect = document.querySelector('.change-collection');
    if (!originalSelect) return;

    // Get the options from the original select
    const options = Array.from(originalSelect.options);
    
    // Collection data - Add floor values and image paths for each collection
    const collectionData = {
        'lil-pudgys': { floor: '1', image: 'static/img/doge-logo.png' },
        'cool-cats': { floor: '8.945', image: 'static/img/doge-logo.png' },
        'bored-apes': { floor: '0.3679', image: 'static/img/doge-logo.png' },
        'crypto-punks': { floor: '-', image: 'static/img/doge-logo.png' },
        'default': { floor: '', image: 'static/img/doge-logo.png' }
    };
    
    // Create the custom select structure
    const customSelectWrapper = document.createElement('div');
    customSelectWrapper.className = 'custom-select-wrapper';
    
    const customSelect = document.createElement('div');
    customSelect.className = 'custom-select';
    
    // Create the trigger element
    const customSelectTrigger = document.createElement('div');
    customSelectTrigger.className = 'custom-select__trigger';
    
    // Create trigger content with image and text
    const triggerContent = document.createElement('div');
    triggerContent.className = 'custom-select__trigger-content';
    
    const triggerImage = document.createElement('img');
    triggerImage.className = 'custom-select__image';
    triggerImage.src = collectionData['default'].image;
    triggerImage.alt = 'Collection';
    
    const triggerText = document.createElement('span');
    triggerText.textContent = originalSelect.options[0].textContent;
    
    triggerContent.appendChild(triggerImage);
    triggerContent.appendChild(triggerText);
    
    // Create floor container for the trigger
    const triggerFloor = document.createElement('div');
    triggerFloor.className = 'custom-select__floor';
    triggerFloor.textContent = '';
    triggerFloor.style.display = 'none'; // Ocultar por defecto
    
    // Add content to trigger
    customSelectTrigger.appendChild(triggerContent);
    customSelectTrigger.appendChild(triggerFloor);
    
    // Create the options container
    const customOptions = document.createElement('div');
    customOptions.className = 'custom-options custom-2';
    
    // Add options to the custom select (skip the first 'Change Collection' option)
    options.forEach((option, index) => {
        // Skip the disabled/placeholder option (usually the first one, with "Change Collection" text)
        if (option.disabled) {
            return; // Skip this iteration
        }
        
        const customOption = document.createElement('span');
        customOption.className = 'custom-option custom-element';
        if (index === originalSelect.selectedIndex && !option.disabled) {
            customOption.classList.add('selected');
        }
        customOption.setAttribute('data-value', option.value);
        
        // Get collection data
        const collection = option.value || 'default';
        const data = collectionData[collection] || collectionData['default'];
        
        // Create option content with image and text
        const optionContent = document.createElement('div');
        optionContent.className = 'custom-option-content';
        
        const optionImage = document.createElement('img');
        optionImage.className = 'custom-option-image';
        optionImage.src = data.image;
        optionImage.alt = option.textContent;
        
        const optionText = document.createElement('span');
        optionText.textContent = option.textContent;
        
        optionContent.appendChild(optionImage);
        optionContent.appendChild(optionText);
        
        // Create floor value for the option
        const optionFloor = document.createElement('span');
        optionFloor.className = 'custom-option-floor';
        optionFloor.textContent = data.floor;
        
        // Add content to option
        customOption.appendChild(optionContent);
        customOption.appendChild(optionFloor);
        
        // Add click event
        customOption.addEventListener('click', function() {
            // Update selected value and image in trigger
            const triggerContent = customSelectTrigger.querySelector('.custom-select__trigger-content');
            const triggerImage = triggerContent.querySelector('.custom-select__image');
            const triggerText = triggerContent.querySelector('span');
            const triggerFloor = customSelectTrigger.querySelector('.custom-select__floor');
            
            triggerImage.src = data.image;
            triggerText.textContent = option.textContent;
            
            // Mostrar FLOOR solo cuando no es "Change Collection"
            if (option.textContent !== 'Change Collection') {
                triggerFloor.style.display = 'flex';
                triggerFloor.textContent = data.floor;
            } else {
                triggerFloor.style.display = 'none';
                triggerFloor.textContent = '';
            }
            
            // Update select value
            originalSelect.value = this.getAttribute('data-value');
            
            // Update selected class
            const selected = customOptions.querySelector('.selected');
            if (selected) {
                selected.classList.remove('selected');
            }
            this.classList.add('selected');
            
            // Close dropdown
            customSelect.classList.remove('open');
            
            // Trigger the change event on the original select
            const event = new Event('change');
            originalSelect.dispatchEvent(event);
        });
        
        customOptions.appendChild(customOption);
    });
    
    // Add click event to toggle dropdown
    customSelectTrigger.addEventListener('click', function() {
        customSelect.classList.toggle('open');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const isClickInside = customSelect.contains(e.target);
        if (!isClickInside) {
            customSelect.classList.remove('open');
        }
    });
    
    // Assemble the custom select
    customSelect.appendChild(customSelectTrigger);
    customSelect.appendChild(customOptions);
    customSelectWrapper.appendChild(customSelect);
    
    // Insert the custom select before the original
    originalSelect.parentNode.insertBefore(customSelectWrapper, originalSelect);
    
    // Hide the original select
    originalSelect.style.display = 'none';
});
