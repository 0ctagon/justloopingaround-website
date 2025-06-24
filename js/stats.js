function toggleFigure(elementId) {
    const figure = document.getElementById(elementId);
    const button = document.getElementById(elementId + "Button");
    if (figure.style.display === "none" || figure.style.display === "") {
        figure.style.display = "block";
        button.textContent = button.textContent.replace("Show", "Hide");
    } else {
        figure.style.display = "none";
        button.textContent = button.textContent.replace("Hide", "Show");
    }
}

document.querySelectorAll('.resizable-figure').forEach(figure => {
    const img = figure.querySelector('img');
    const handle = figure.querySelector('.resize-handle');
    const aspectRatio = img.naturalWidth / img.naturalHeight;

    let isResizing = false;

    handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isResizing = true;
        document.body.style.cursor = 'nwse-resize';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const rect = figure.getBoundingClientRect();
        const newWidth = e.clientX - rect.left;

        const newHeight = newWidth / aspectRatio;

        figure.style.width = `${newWidth}px`;
        figure.style.height = `${newHeight}px`;
    });

    window.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = 'default';
        }
    });
});
