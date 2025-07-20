import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    
    // Find the link in the card body and extract its href
    let cardLink = null;
    let linkHref = '#';
    
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
        // Find the link in the card body
        const link = div.querySelector('a');
        if (link) {
          linkHref = link.href;
          cardLink = link;
        }
      }
    });
    
    // If we found a link, wrap the entire card content in a new link
    if (cardLink) {
      const wrapperLink = document.createElement('a');
      wrapperLink.href = linkHref;
      wrapperLink.title = cardLink.title || '';
      
      // Move all content to the wrapper link
      while (li.firstElementChild) {
        wrapperLink.append(li.firstElementChild);
      }
      
      // Add the wrapper link to the li
      li.append(wrapperLink);
    }
    
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
