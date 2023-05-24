export function generatePrompt(components={}, isExtension=false) {
    return `
    You are a psychologist and trusted friend, and we are having a simple conversation over tea.
    I ran ${isExtension ? 'this page' : 'my words'}:
    
    \`${components.query || '{{ error: no words found }}'}\`
  
    Through a personality analysis tool. It gave me this JSON data back with the format of { trait: percentage, ... }:
  
     ${JSON.stringify(components.bigFiveData) || '{{ error: no traits found }}'}
  
    Tell me what parts of ${isExtension ? 'this page' : 'my words'} or ${isExtension ? 'its' : 'my'} communication style
    might correspond to scores that stand out, and why. 
    
    Keep your response to a couple sentences. You don't need to touch on everything. Be nice, and touch on at
    least two notable big five traits with high or low scores. Don't reference "data" in your response, instead 
    keep the focus on the words.
    `;
}