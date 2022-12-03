import React, {Component} from 'react';
import axios from 'axios';
import './App.css';
import { BarChart, Bar, Line, XAxis, YAxis } from 'recharts';

function collectScores(dayScore: any, name : any, member :any) {
  for(let day = 1;day <= 25;++day) {
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

function toData(leaderBoard : any) : any {
  let dayScore : any[] = [];

  Object.keys(leaderBoard.members).forEach(member => {
    collectScores(dayScore, leaderBoard.members[member].name, leaderBoard.members[member]);
  });
  
  //const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, ...];
  const data : any[] = [];
  
  for(let d = 0;d < dayScore.length;++d) {
    let day = dayScore[d];
    const personData : any = {};
    const startTime = new Date(2021,11,1+d).getTime() - 3 * 60 * 60 * 1000;
    for(let s = 0;s < day.length;++s) {
        let star = day[s];
        star.sort((a : any,b : any) => a.date.getTime() - b.date.getTime());
        for(let p = 0;p < star.length;++p) {
            const person = star[p];
            const amt = (person.date.getTime() - startTime)/60000;
            if(s === 0) {
              let dataPerson = {name: person.name, silver: amt};
              personData[person.name] = dataPerson;
              data.push(dataPerson);
            } 
            else {
               let dataPerson = personData[person.name];
               dataPerson.gold = amt;
            }
            //console.log(`${person.name} (${(})`);
        }
      }
    }
    return data;
}

function getScores(leaderBoard : any) : Array<any> {
  let dayScore : any[] = [];

  Object.keys(leaderBoard.members).forEach(member => {
    collectScores(dayScore, leaderBoard.members[member].name, leaderBoard.members[member]);
  });

  const numPeople = Object.keys(leaderBoard.members).length;
  
  const personToScoreMap = new Map<string,number>();
  Object.keys(leaderBoard.members).forEach(member => personToScoreMap.set(leaderBoard.members[member].name, 0));

  for(let d = 0;d < dayScore.length;++d) {
    let day = dayScore[d];  
    for(let s = 0;s < day.length;++s) {
        let star = day[s];
        star.sort((a : any,b : any) => a.date.getTime() - b.date.getTime());
        for(let p = 0;p < star.length;++p) {
            const person = star[p];
            let currentScore = personToScoreMap.get(person.name);
            if(currentScore === undefined) {
              currentScore = 0;
            }
            personToScoreMap.set(person.name,currentScore  + numPeople - p)
            
        }
      }
    }
    let scoreBoard = Array.from(personToScoreMap.entries());
    scoreBoard.sort((e1, e2) => e2[1] - e1[1]);
    return scoreBoard;
}

function toDatas(leaderBoard : any) : any {
  let dayScore : any[] = [];

  Object.keys(leaderBoard.members).forEach(member => {
    collectScores(dayScore, leaderBoard.members[member].name, leaderBoard.members[member]);
  });
  
  //const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, ...];
  const data : any[] = [];
  
  for(let d = 0;d < dayScore.length;++d) {
    let dataForDay : any = [];
    let day = dayScore[d];
    const personData : any = {};
    const startTime = new Date(2021,11,1+d).getTime() - 3 * 60 * 60 * 1000;
    for(let s = 0;s < day.length;++s) {
        let star = day[s];
        star.sort((a : any,b : any) => a.date.getTime() - b.date.getTime());
        for(let p = 0;p < star.length;++p) {
            const person = star[p];
            const amt = (person.date.getTime() - startTime)/60000;
            if(s === 0) {
              let name = person.name;
              if(name == null)
              {
                name = "unknown";
              }
              let dataPerson = {name: name.substr(0,4), silver: amt};
              personData[name] = dataPerson;
              dataForDay.push(dataPerson);
            } 
            else {
              let name = person.name;
              if(name == null)
              {
                name = "unknown";
              }
               let dataPerson = personData[name];
               dataPerson.gold = amt;
               dataPerson.delta = dataPerson.gold - dataPerson.silver; 
            }
            //console.log(`${person.name} (${(})`);
        }
      }
      data.push(dataForDay);
    }
    return data;
}
interface AppState {
  leaderboard : any;
}

export class App extends Component<{},AppState> {
  constructor(props : any) {
    super(props);
    this.state = this.getDefaultState();
  }

  getDefaultState() : AppState {
    return { leaderboard: JSON.parse('{"owner_id":"20921","event":"2020","members":{"20921":{"last_star_ts":"1607492386","stars":18,"name":"Heem Patel","local_score":249,"completion_day_level":{"1":{"1":{"get_star_ts":"1606854538"},"2":{"get_star_ts":"1606854742"}},"8":{"1":{"get_star_ts":"1607404932"},"2":{"get_star_ts":"1607406426"}},"5":{"1":{"get_star_ts":"1607145553"},"2":{"get_star_ts":"1607146393"}},"2":{"1":{"get_star_ts":"1606933333"},"2":{"get_star_ts":"1606933555"}},"7":{"2":{"get_star_ts":"1607375216"},"1":{"get_star_ts":"1607373965"}},"3":{"2":{"get_star_ts":"1607016914"},"1":{"get_star_ts":"1607016123"}},"4":{"1":{"get_star_ts":"1607060613"},"2":{"get_star_ts":"1607072157"}},"6":{"2":{"get_star_ts":"1607290657"},"1":{"get_star_ts":"1607290422"}},"9":{"2":{"get_star_ts":"1607492386"},"1":{"get_star_ts":"1607491178"}}},"id":"20921","global_score":0},"1059552":{"completion_day_level":{"1":{"2":{"get_star_ts":"1606857891"},"1":{"get_star_ts":"1606857598"}},"2":{"1":{"get_star_ts":"1606937488"},"2":{"get_star_ts":"1606937917"}}},"global_score":0,"id":"1059552","last_star_ts":"1606937917","stars":4,"local_score":24,"name":"Ari Berkson"},"406068":{"local_score":289,"name":"kungfoomaster","last_star_ts":"1607491880","stars":18,"id":"406068","global_score":0,"completion_day_level":{"7":{"1":{"get_star_ts":"1607321999"},"2":{"get_star_ts":"1607322973"}},"3":{"2":{"get_star_ts":"1606974277"},"1":{"get_star_ts":"1606973399"}},"4":{"1":{"get_star_ts":"1607059278"},"2":{"get_star_ts":"1607061122"}},"6":{"2":{"get_star_ts":"1607232408"},"1":{"get_star_ts":"1607231797"}},"9":{"2":{"get_star_ts":"1607491880"},"1":{"get_star_ts":"1607491181"}},"1":{"2":{"get_star_ts":"1606800297"},"1":{"get_star_ts":"1606799772"}},"8":{"1":{"get_star_ts":"1607405498"},"2":{"get_star_ts":"1607406135"}},"5":{"2":{"get_star_ts":"1607146801"},"1":{"get_star_ts":"1607146435"}},"2":{"2":{"get_star_ts":"1606889164"},"1":{"get_star_ts":"1606888850"}}}},"828924":{"global_score":0,"id":"828924","completion_day_level":{},"name":"aramadas","local_score":0,"stars":0,"last_star_ts":0},"1063014":{"name":"Chris Larson","local_score":205,"stars":16,"last_star_ts":"1607410846","completion_day_level":{"8":{"2":{"get_star_ts":"1607410846"},"1":{"get_star_ts":"1607410158"}},"5":{"2":{"get_star_ts":"1607151505"},"1":{"get_star_ts":"1607151175"}},"2":{"1":{"get_star_ts":"1606927119"},"2":{"get_star_ts":"1606927645"}},"1":{"1":{"get_star_ts":"1606855572"},"2":{"get_star_ts":"1606855782"}},"6":{"2":{"get_star_ts":"1607238677"},"1":{"get_star_ts":"1607237484"}},"4":{"1":{"get_star_ts":"1607102038"},"2":{"get_star_ts":"1607104408"}},"7":{"2":{"get_star_ts":"1607326039"},"1":{"get_star_ts":"1607325070"}},"3":{"1":{"get_star_ts":"1607016258"},"2":{"get_star_ts":"1607016731"}}},"id":"1063014","global_score":0},"17405":{"completion_day_level":{"1":{"1":{"get_star_ts":"1606838162"},"2":{"get_star_ts":"1606838493"}},"2":{"2":{"get_star_ts":"1606923123"},"1":{"get_star_ts":"1606922877"}},"8":{"2":{"get_star_ts":"1607440333"},"1":{"get_star_ts":"1607439604"}},"5":{"2":{"get_star_ts":"1607304701"},"1":{"get_star_ts":"1607304238"}},"3":{"1":{"get_star_ts":"1607010614"},"2":{"get_star_ts":"1607010995"}},"7":{"1":{"get_star_ts":"1607356306"},"2":{"get_star_ts":"1607356863"}},"4":{"2":{"get_star_ts":"1607303644"},"1":{"get_star_ts":"1607302502"}},"6":{"1":{"get_star_ts":"1607305209"},"2":{"get_star_ts":"1607305462"}}},"id":"17405","global_score":0,"last_star_ts":"1607440333","stars":16,"local_score":188,"name":"Johnny Owens"},"1072031":{"local_score":40,"name":"Shenc0411","last_star_ts":"1607042496","stars":6,"global_score":0,"id":"1072031","completion_day_level":{"1":{"2":{"get_star_ts":"1606861092"},"1":{"get_star_ts":"1606860663"}},"3":{"1":{"get_star_ts":"1607042333"},"2":{"get_star_ts":"1607042496"}},"2":{"1":{"get_star_ts":"1606941119"},"2":{"get_star_ts":"1606941273"}}}},"407505":{"stars":18,"last_star_ts":"1607492968","name":"skyhawk2891","local_score":289,"id":"407505","global_score":0,"completion_day_level":{"3":{"2":{"get_star_ts":"1606975472"},"1":{"get_star_ts":"1606974861"}},"7":{"1":{"get_star_ts":"1607319749"},"2":{"get_star_ts":"1607320265"}},"4":{"1":{"get_star_ts":"1607060663"},"2":{"get_star_ts":"1607063587"}},"6":{"2":{"get_star_ts":"1607231732"},"1":{"get_star_ts":"1607231407"}},"9":{"1":{"get_star_ts":"1607491914"},"2":{"get_star_ts":"1607492968"}},"1":{"2":{"get_star_ts":"1606849040"},"1":{"get_star_ts":"1606848842"}},"2":{"2":{"get_star_ts":"1606892817"},"1":{"get_star_ts":"1606892014"}},"8":{"1":{"get_star_ts":"1607404579"},"2":{"get_star_ts":"1607405373"}},"5":{"1":{"get_star_ts":"1607146295"},"2":{"get_star_ts":"1607146489"}}}},"833780":{"stars":0,"last_star_ts":0,"name":"Pujan Dave","local_score":0,"id":"833780","global_score":0,"completion_day_level":{}},"1080436":{"name":"Peilin Li","local_score":59,"last_star_ts":"1607112449","stars":7,"completion_day_level":{"3":{"2":{"get_star_ts":"1607029930"},"1":{"get_star_ts":"1607029329"}},"1":{"1":{"get_star_ts":"1606873418"},"2":{"get_star_ts":"1606936578"}},"4":{"1":{"get_star_ts":"1607112449"}},"2":{"1":{"get_star_ts":"1606937551"},"2":{"get_star_ts":"1606937926"}}},"id":"1080436","global_score":0},"456707":{"last_star_ts":"1606938342","stars":4,"local_score":20,"name":"Scott K","id":"456707","global_score":0,"completion_day_level":{"1":{"2":{"get_star_ts":"1606850776"},"1":{"get_star_ts":"1606850589"}},"2":{"1":{"get_star_ts":"1606937859"},"2":{"get_star_ts":"1606938342"}}}},"627405":{"stars":16,"last_star_ts":"1607405546","name":"Peter Lewis","local_score":237,"id":"627405","global_score":0,"completion_day_level":{"4":{"1":{"get_star_ts":"1607092857"},"2":{"get_star_ts":"1607095782"}},"7":{"1":{"get_star_ts":"1607322806"},"2":{"get_star_ts":"1607324446"}},"3":{"2":{"get_star_ts":"1606973279"},"1":{"get_star_ts":"1606972512"}},"6":{"1":{"get_star_ts":"1607232164"},"2":{"get_star_ts":"1607232597"}},"1":{"2":{"get_star_ts":"1606829462"},"1":{"get_star_ts":"1606801749"}},"8":{"2":{"get_star_ts":"1607405546"},"1":{"get_star_ts":"1607404536"}},"5":{"1":{"get_star_ts":"1607146055"},"2":{"get_star_ts":"1607146887"}},"2":{"1":{"get_star_ts":"1606925362"},"2":{"get_star_ts":"1606926228"}}}},"761893":{"completion_day_level":{},"global_score":0,"id":"761893","name":"jstopyra","local_score":0,"last_star_ts":0,"stars":0},"1092782":{"last_star_ts":"1607417474","stars":16,"local_score":217,"name":"jfriar","completion_day_level":{"1":{"1":{"get_star_ts":"1606898212"},"2":{"get_star_ts":"1606898483"}},"2":{"1":{"get_star_ts":"1606899999"},"2":{"get_star_ts":"1606900665"}},"5":{"2":{"get_star_ts":"1607166049"},"1":{"get_star_ts":"1607165300"}},"8":{"2":{"get_star_ts":"1607417474"},"1":{"get_star_ts":"1607415203"}},"3":{"2":{"get_star_ts":"1606978738"},"1":{"get_star_ts":"1606978374"}},"7":{"1":{"get_star_ts":"1607326212"},"2":{"get_star_ts":"1607328723"}},"4":{"2":{"get_star_ts":"1607067871"},"1":{"get_star_ts":"1607060810"}},"6":{"2":{"get_star_ts":"1607236948"},"1":{"get_star_ts":"1607236199"}}},"id":"1092782","global_score":0},"828851":{"id":"828851","global_score":0,"completion_day_level":{},"last_star_ts":0,"stars":0,"local_score":0,"name":"Stewart Graff"},"410633":{"completion_day_level":{"5":{"2":{"get_star_ts":"1607473180"},"1":{"get_star_ts":"1607472486"}},"6":{"1":{"get_star_ts":"1607474285"},"2":{"get_star_ts":"1607475881"}},"2":{"1":{"get_star_ts":"1607354342"},"2":{"get_star_ts":"1607355034"}},"1":{"1":{"get_star_ts":"1606849409"},"2":{"get_star_ts":"1606857502"}},"4":{"2":{"get_star_ts":"1607435870"},"1":{"get_star_ts":"1607386570"}},"3":{"2":{"get_star_ts":"1607372581"},"1":{"get_star_ts":"1607366766"}}},"id":"410633","global_score":0,"local_score":97,"name":"Tamir Nadav","last_star_ts":"1607475881","stars":12},"748137":{"local_score":316,"name":"Ivan Gusev","stars":18,"last_star_ts":"1607491049","global_score":0,"id":"748137","completion_day_level":{"1":{"2":{"get_star_ts":"1606855675"},"1":{"get_star_ts":"1606853280"}},"2":{"1":{"get_star_ts":"1606894969"},"2":{"get_star_ts":"1606895208"}},"5":{"1":{"get_star_ts":"1607145262"},"2":{"get_star_ts":"1607145908"}},"8":{"2":{"get_star_ts":"1607404576"},"1":{"get_star_ts":"1607404029"}},"4":{"2":{"get_star_ts":"1607060735"},"1":{"get_star_ts":"1607058835"}},"3":{"2":{"get_star_ts":"1606973103"},"1":{"get_star_ts":"1606972404"}},"7":{"2":{"get_star_ts":"1607319332"},"1":{"get_star_ts":"1607318633"}},"9":{"2":{"get_star_ts":"1607491049"},"1":{"get_star_ts":"1607490579"}},"6":{"1":{"get_star_ts":"1607230960"},"2":{"get_star_ts":"1607231360"}}}},"1067035":{"name":"Alain Juárez Pérez","local_score":0,"stars":0,"last_star_ts":0,"completion_day_level":{},"id":"1067035","global_score":0},"127899":{"last_star_ts":0,"stars":0,"local_score":0,"name":"Cort Keefer","global_score":0,"id":"127899","completion_day_level":{}},"21764":{"name":"Jeff Brizzolara","local_score":124,"stars":13,"last_star_ts":"1607424538","global_score":0,"id":"21764","completion_day_level":{"3":{"1":{"get_star_ts":"1607045725"},"2":{"get_star_ts":"1607046336"}},"1":{"1":{"get_star_ts":"1606924111"},"2":{"get_star_ts":"1606926973"}},"4":{"2":{"get_star_ts":"1607214403"},"1":{"get_star_ts":"1607212032"}},"5":{"2":{"get_star_ts":"1607218191"},"1":{"get_star_ts":"1607217213"}},"6":{"2":{"get_star_ts":"1607387115"},"1":{"get_star_ts":"1607385364"}},"8":{"1":{"get_star_ts":"1607424538"}},"2":{"2":{"get_star_ts":"1606988504"},"1":{"get_star_ts":"1606987365"}}}}}}') };
  }

  componentDidMount = async () => {
    const data = await axios.get('/leaderboard_new.json');
    this.setState({ leaderboard: data.data});
  }

  scoreBoard = () => {
    const scoreBoard = getScores(this.state.leaderboard);
    return (<table><thead><th><td>Name</td>Score<td></td></th></thead><tbody>
      {scoreBoard.map(e => <tr><td>{e[0]}</td><td>{e[1]}</td></tr>)}
      </tbody></table>)
  }

  render() {
    const datas = toDatas(this.state.leaderboard);
 
    const datas2 : any[] = [];
    datas.forEach((element : any[]) => {
      const newElement = element.slice();
      newElement.sort((x : any, y : any) =>
      {
        if(x.delta == null && y.delta == null) return 0; 
        if(x.delta == null) return 1;
        if(y.delta == null) return -1;
        return x.delta - y.delta
      }
      );
      datas2.push(newElement);
    });

    const bars = datas.map( (d : any, index : number) => (
      <div key={index}>
      <h1>Day {index+1}</h1>
      <BarChart width={d.length*100 + 100} height={800} data={d}>
      <XAxis dataKey="name" />
      <YAxis />
      <Bar dataKey="silver" fill="#8884d8" />
      <Bar dataKey="gold" fill="#82ca9d" />
      </BarChart>
      <BarChart key={index * 100} width={d.length*100 + 100} height={800} data={datas2[index]}>
      <XAxis dataKey="name" />
      <YAxis />
      <Bar dataKey="delta" fill="#ff84d8" />
      </BarChart> 
      </div> 
    )); 

    return (
      <div className="App">
        <header className="App-header">
        {bars}
        {this.scoreBoard()}
      </header>
      </div>
    );
  }  
}

export default App;
