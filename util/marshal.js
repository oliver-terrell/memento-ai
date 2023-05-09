const Big5Dictionary = {
    intellectual: [ 'Openness' ],
    imaginative: [ 'Openness' ],
    artistic: [ 'Openness' ],
    adventurous: [ 'Openness' ],
    authority_challenging: [ 'Openness' ],
    excitement_seeking: [ 'Openness', 'Extraversion' ],
    emotionally_aware: [ 'Openness' ],
    disciplined: [ 'Conscientiousness' ],
    achievement_striving: [ 'Conscientiousness' ],
    self_efficacy: [ 'Conscientiousness' ],
    cautious: [ 'Conscientiousness' ],
    orderliness: [ 'Conscientiousness' ],
    dutiful: [ 'Conscientiousness' ],
    outgoing: [ 'Extraversion' ],
    gregariousness: [ 'Extraversion' ],
    assertive: [ 'Extraversion' ],
    cheerful: [ 'Extraversion' ],
    extraversion: [ 'Extraversion' ],
    trusting: [ 'Agreeableness' ],
    altruism: [ 'Agreeableness' ],
    cooperative: [ 'Agreeableness' ],
    sympathy: [ 'Agreeableness' ],
    agreeableness: [ 'Agreeableness' ],
    uncompromising: [ 'Agreeableness' ],
    modesty: [ 'Agreeableness' ],
    immoderation: [ 'Neuroticism (Emotional Stability)' ],
    fiery: [ 'Neuroticism (Emotional Stability)' ],
    stress_prone: [ 'Neuroticism (Emotional Stability)' ],
    neuroticism: [ 'Neuroticism (Emotional Stability)' ],
    melancholy: [ 'Neuroticism (Emotional Stability)' ],
    self_conscious: [ 'Neuroticism (Emotional Stability)' ]
};


export const getAspectPercentages = (data) => {
    const aspects = {
        'Openness': 0,
        'Conscientiousness': 0,
        'Extraversion': 0,
        'Agreeableness': 0,
        'Neuroticism (Emotional Stability)': 0
    };

    for (const [trait, score] of Object.entries(data[0])) {
        if (Big5Dictionary.hasOwnProperty(trait)) {
            Big5Dictionary[trait].forEach(aspect => {
                aspects[aspect] += score;
            });
        }
    };

    for (const [aspect, score] of Object.entries(aspects)) {
        if (["Openness", "Agreeableness"].includes(aspect)) {
            aspects[aspect] = Math.round((score / 7) * 100);
        } else {
            aspects[aspect] = Math.round((score / 6) * 100);
        }
    }

    console.log(aspects);
    return aspects;
};
