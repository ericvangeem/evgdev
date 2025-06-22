export default async function decorate(block) {
  // Find the picture element and caption within the existing structure
  const picture = block.querySelector('picture');
  const caption = block.querySelector('p:not(:has(picture))');

  if (picture) {
    // Add classes to the existing elements for styling
    if (caption) {
      caption.className = 'image-caption';
    }

    // Add a class to the picture container for styling
    const pictureContainer = picture.closest('p');
    if (pictureContainer) {
      pictureContainer.className = 'image-container';
    }
  }
}
