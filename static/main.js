// Add copy buttons to all <code> elements and handle copy functionality

document.addEventListener("DOMContentLoaded", function() {
  // Find all <code> elements
  document.querySelectorAll("code").forEach(function(codeElem, idx) {
    // Create a wrapper div for positioning
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";
    // Insert wrapper before codeElem
    codeElem.parentNode.insertBefore(wrapper, codeElem);
    wrapper.appendChild(codeElem);

    // Create the copy button (symbol: 📋)
    const btn = document.createElement("button");
    btn.textContent = "📋";
    btn.title = "Copy code";
    btn.style.position = "absolute";
    btn.style.top = "2px";
    btn.style.right = "2px";
    btn.style.fontSize = "1em";
    btn.style.padding = "2px 6px";
    btn.style.cursor = "pointer";
    btn.style.background = "#e7eff6";
    btn.style.border = "1px solid #2a4d69";
    btn.style.borderRadius = "2px";
    btn.style.zIndex = "2";
    btn.style.width =".5px";
    btn.style.height= ".5px";
    btn.style.overflow ="hidden";
    btn.style.transition = "width 0.3s ease, overflow 0.3s ease";

    // Add click event to copy code
    btn.addEventListener("click", function() {
      const text = codeElem.innerText || codeElem.textContent;
      navigator.clipboard.writeText(text).then(function() {
        btn.textContent = "✅";
        setTimeout(() => btn.textContent = "📋", 1200);
      });
    });

    // Add button to wrapper
    wrapper.appendChild(btn);
  });
});