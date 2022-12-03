var fs = require('fs');

const data = JSON.parse(fs.readFileSync("./day6.json"));
console.log(data.owner_id);

let dayScore = [];

function collectScores(name , member) {
    for(let day = 1;day <= 6;++day) {
        for(let star = 1;star <= 2;++star) {
            const mday = member.completion_day_level[day];
            if(mday == null) continue;
            const mstar = mday[star];
            if(mstar == null) continue;
            const ts = mstar.get_star_ts;
            if(ts == null) continue;
            const time = new Date(Number(ts) * 1000);
            
            if(dayScore[day-1] == null) {
                dayScore[day-1] = [];
            }

            if(dayScore[day-1][star-1] == null) {
                dayScore[day-1][star-1] = [];
            }
            dayScore[day-1][star-1].push({ name: name, date: time});
        }
    }
} 

Object.keys(data.members).forEach(member => {
    collectScores(data.members[member].name, data.members[member]);
});

for(let d = 0;d < dayScore.length;++d) {
    let day = dayScore[d];
    for(let s = 0;s < day.length;++s) {
        let star = day[s];
        star.sort((a,b) => a.date.getTime() - b.date.getTime());
        console.log(`Day ${d+1} Star ${s+1}:`)
        for(let p = 0;p < star.length;++p) {
            const person = star[p]; 
            console.log(`${person.name} (${(person.date.getTime() - star[0].date.getTime())/60000})`);
        }
    }
}