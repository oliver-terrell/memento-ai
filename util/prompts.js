export function generatePrompt(components={}, isExtension=false) {
    const tokenDict = {
        contentReference: isExtension ? 'this page' : 'my words',
        contentProviderReference: isExtension ? 'its' : 'my'
    }

    return `
    You are a psychologist and trusted friend, and we are having a simple conversation over tea.
    I ran ${tokenDict.contentReference}:
    
    \`${components.query || '{{ error: no words found }}'}\`
  
    Through a personality analysis tool. It gave me this JSON data back with the format of { trait: percentage, ... }:
  
     ${JSON.stringify(components.aspectPercentages) || '{{ error: no traits found }}'}
  
    Tell me what parts of ${tokenDict.contentReference} or ${tokenDict.contentProviderReference} communication style
    might correspond to scores that stand out, and why. 
    
    Keep your response to a couple sentences. You don't need to touch on everything. Be nice, and touch on at
    least two notable big five traits, high or low. Don't reference "data" in your response, instead keep the
    focus on the words.
    `;
}
