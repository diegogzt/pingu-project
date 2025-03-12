document.querySelectorAll('.grid-btn').forEach(button => {
    button.addEventListener('click', () => {
        const columns = button.getAttribute('data-columns');
        document.querySelector('.body').style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    });
});

document.querySelector('.price-filter').addEventListener('change', (event) => {
    const value = event.target.value;
    const items = Array.from(document.querySelectorAll('.item'));
    items.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
        const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));
        return value === 'low' ? priceA - priceB : priceB - priceA;
    });
    const content = document.querySelector('.content');
    content.innerHTML = '';
    items.forEach(item => content.appendChild(item));
});

document.querySelector('.toggle-sidebar-btn').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});
