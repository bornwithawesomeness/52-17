import React from 'react'
import {
  Grid, Row, Col,
  ButtonToolbar, Button, ButtonGroup, ControlLabel
} from 'react-bootstrap'
import moment from 'moment'
import {Icon} from 'react-fa'
import Sound from 'react-sound'
import Slider from 'react-rangeslider'

import axios from 'axios'

import 'react-rangeslider/lib/index.css'
import '../styles/menu_topside.css'
import '../styles/demo.css'
import * as radioStations from '../constants/radiostations'
import bwaAvatar from '../img/bornwithawesomeness.png'
import SettingsPanel from './settingspanel'

var defaultMinutesWorking = 52;
var defaultMinutesBreak = 17;
export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currTime: moment().format('HH:mm:ss'),
      secondsRemaining: null,
      workTimeRunning: false,
      startSound: false,
      breakTimeRunning: false,
      soundMuted: false,
      soundStopped: false,
      songPlaying: false,
      volume: 80,
      isMenuOpen: true,
      isRadio: true,
      hasNet: true,
      radioStation: null
    }
  }

  componentDidMount() {
    // this.timerHandle = setInterval(()=>{
    //   this.setState({
    //     currTime: moment().format('HH:mm:ss')
    //   });
    // });
    // soundManager.setup({debugMode: false});
    this.setTimeValues(defaultMinutesWorking, defaultMinutesBreak);
    this.doesInternetConnectionExist();
  }

  componentWillUnmount() {
    // if(this.timerHandle){
    //   clearInterval(this.timerHandle);
    // }
  }

  doesInternetConnectionExist = () => {
    var self = this;
    axios.get('https://jsonplaceholder.typicode.com/posts/1').then(function(response){
      self.setState({
        hasNet: true
      })
    }).catch(function(error){
      if(error){
        self.setState({
          hasNet: false
        })
      }
    })
  }

  setTimeValues = (minutesWorking, minutesBreak) => {
    this.setState({
      minutesWorking,
      minutesBreak,
      workTimeRemaining: moment(`${minutesWorking}:00`, "mm:ss").format("mm:ss"),
      breakTimeRemaining: moment(`${minutesBreak}:00`, "mm:ss").format("mm:ss")
    })
  }

  workMinutesChange = (e) => {
    this.setState({
      minutesWorking: e.target.value
    })
  }

  breakMinutesChange = (e) => {
    this.setState({
      minutesBreak: e.target.value
    })
  }

  toggleMenu = () => {
    if(this.state.isMenuOpen){
      document.body.classList.remove('show-menu');
    }else{
      document.body.classList.add('show-menu');
    }
  }

  handleMenuClick = () => {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen
    }, () => {
      this.toggleMenu();
    })
  }

  playPauseTimer = () => {
    if(this.state.workTimeRunning){
      this.setState({
        workTimeRunning: false
      }, () => {
        clearInterval(this.workTimer);
        clearInterval(this.breakTimer);
      })
    }else{
      this.setState({
        workTimeRunning: true,
        startSound: true
      }, () => {
        if(this.state.breakTimeRunning){
          this.skipBreak();
        }else{
          this.processTime('work');
        }
      });
    }
  }

  processTime = (type) => {
    let minutes = type == 'work'?this.state.minutesWorking:this.state.minutesBreak;
    let timeRemainingVal = type == 'work'?'workTimeRemaining':'breakTimeRemaining';
    if(this.state[timeRemainingVal] != moment(`${minutes}:00`, "mm:ss").format("mm:ss")){
      let secondsRemaining = moment.duration("00:"+this.state[timeRemainingVal]).asSeconds();
      let eventTime = moment().add(secondsRemaining,'seconds').unix();
      let currTime = moment().unix();
      var diffTime = eventTime - currTime;
      var duration = moment.duration(diffTime*1000, 'milliseconds');
      var interval = 1000;
    }else{
      let eventTime = moment().add(`${minutes}`,'minutes').unix();
      let currTime = moment().unix();
      var diffTime = eventTime - currTime;
      var duration = moment.duration(diffTime*1000, 'milliseconds');
      var interval = 1000;
    }

    let self = this;

    this[`${type}Timer`] = setInterval(function(){
      duration = moment.duration(duration - interval, 'milliseconds');
      let timeRemaining = `${duration._data.minutes}:${duration._data.seconds}`;
      self.setState({
        [timeRemainingVal]: moment(timeRemaining, "mm:ss").format("mm:ss")
      }, () => {
        let secondsRemaining = moment.duration("00:"+timeRemaining).asSeconds();
        if(secondsRemaining == 0){
          clearInterval(self[`${type}Timer`]);
          if(type=='work'){
            self.breakTimeHandler();
          }else{
            self.skipBreak();
          }
        }
      })

    }, interval);
  }

  breakTimeHandler = () => {
    this.setState({
      breakTimeRunning: true,
      volume: 80
    }, () => {
      this.stopTimer('work');
      this.processTime('break');
    })
  }

  stopTimer = (type) => {
    let minutes = type == 'work'?this.state.minutesWorking:this.state.minutesBreak;
    let timeRemainingVal = type == 'work'?'workTimeRemaining':'breakTimeRemaining';
    let running = type == 'work'?'workTimeRunning':'breakTimeRunning';
    this.setState({
      [timeRemainingVal]: moment(`${minutes}:00`, "mm:ss").format("mm:ss"),
      [running]: false
    }, () => {
      clearInterval(this.workTimer)
    })
  }

  handleSongLoading = (data) => {
  }

  handleSongPlaying = (data) => {
    this.setState({
      songPlaying: true
    })
  }

  muteSound = () => {
    this.setState({
      soundMuted: !this.state.soundMuted
    }, () => {
      if(this.state.soundMuted){
        this.setState({
          volume: 0
        })
      }else{
        this.setState({
          volume: 80
        })
      }
    })
  }

  volumeDown = () => {
    this.setState({
      volume: this.state.volume == 0 ? 0 : this.state.volume - 10
    })
  }

  volumeUp = () => {
    this.setState({
      volume: this.state.volume == 100 ? 100 : this.state.volume + 10
    })
  }

  handleOnVolumeChange = (value) => {
    this.setState({
      volume: value
    })
  }

  skipBreak = () => {
    this.setState({
      breakTimeRunning: false
    }, () => {
      this.stopTimer('break');
      this.playPauseTimer();
    })
  }

  randomIntFromInterval = (min,max) => {
    return _.random(min, max);
  }

  handleFinishedPlaying = (data) => {
    // console.log("finished", data);
  }

  handleFinishedStartSound = (data) => {
    this.setState({
      startSound: false
    })
  }

  changeAlarmRadio = (bool) => {
    this.setState({
      isRadio: bool
    })
  }

  setRadioStation = (radioStation) => {
    this.setState({
      radioStation
    })
  }

  getFirstRadioStation = () => {
    for(var key in radioStations){
      return key;
      break;
    }
  }

  render() {
    let breakTimeRemainingSec = moment.duration("00:"+this.state.breakTimeRemaining).asSeconds();
    return (
      <div className="cont-100">
        <div className="menu-wrap">
  				<nav className="menu-top">
  					<div className="profile"><img src={bwaAvatar} alt="bornwithawesomeness" /><span>bornwithawesomeness</span></div>
  					<div className="icon-list">
  						{/* <a href="#"><i className="fa fa-fw fa-star-o"></i></a>
  						<a href="#"><i className="fa fa-fw fa-bell-o"></i></a>
  						<a href="#"><i className="fa fa-fw fa-envelope-o"></i></a>
  						<a href="#"><i className="fa fa-fw fa-comment-o"></i></a> */}
  					</div>
  				</nav>
          <SettingsPanel
            minutesBreak={this.state.minutesBreak}
            minutesWorking={this.state.minutesWorking}
            workMinutesChange={this.workMinutesChange}
            breakMinutesChange={this.breakMinutesChange}
            setTimeValues={this.setTimeValues}
            handleMenuClick={this.handleMenuClick}
            stopTimer={this.stopTimer}
            changeAlarmRadio={this.changeAlarmRadio}
            isRadio={this.state.isRadio}
            hasNet={this.state.hasNet}
            radioStations={radioStations}
            setRadioStation={this.setRadioStation}
          />
  			</div>
        <button className="menu-button" id="open-button" onClick={this.handleMenuClick}>Open Menu</button>
        <div className="content-wrap">
  				<div className="content">
  					<header className="codrops-header">
              <div className="time-cont">
                {
                  this.state.breakTimeRunning?(
                    <div className="break-msg-cont">
                      BREAK MUNA
                      <div style={{fontSize: '20px', color:'grey'}}>Break-time remaining: <span style={{color:'white'}}>{this.state.breakTimeRemaining}</span></div>
                    </div>
                  ):this.state.workTimeRemaining
                }
                <Sound
                  url={(this.state.breakTimeRunning && breakTimeRemainingSec<23)?"22countdown.mp3":(this.state.isRadio?(this.state.radioStation?radioStations[this.state.radioStation].link:radioStations[this.getFirstRadioStation()].link):"alarm.mp3")}
                  playStatus={this.state.breakTimeRunning?(this.state.soundStopped?Sound.status.STOPPED:Sound.status.PLAYING):Sound.status.STOPPED}
                  playFromPosition={0}
                  onLoading={this.handleSongLoading}
                  onPlaying={this.handleSongPlaying}
                  onFinishedPlaying={this.handleFinishedPlaying}
                  volume={this.state.volume}
                />
                {
                  this.state.startSound?(
                    <Sound
                      url={"beep.mp3"}
                      playStatus={this.state.startSound?Sound.status.PLAYING:Sound.status.STOPPED}
                      playFromPosition={0}
                      onLoading={this.handleSongLoading}
                      onPlaying={this.handleSongPlaying}
                      onFinishedPlaying={this.handleFinishedStartSound}
                      volume={this.state.volume}
                    />
                  ):null
                }
                <div>
                    {
                      this.state.breakTimeRunning ? (
                        [

                            <Button bsSize="lg" bsStyle="warning" onClick={this.muteSound} key="volume-off">
                              <Icon name={"volume-off"} size="2x" />
                            </Button>,
                            <Button bsSize="lg" bsStyle="info" onClick={this.volumeDown} key="volume-down">
                              <Icon name={"volume-down"} size="2x" />
                            </Button>,
                          <div style={{width:'300px', display:'inline-block', verticalAlign:'middle',}} key="volume-slider">
                            <Slider
                              value={this.state.volume}
                              onChange={this.handleOnVolumeChange}
                              orientation="horizontal"
                            />
                          </div>,
                            <Button bsSize="lg" bsStyle="primary" onClick={this.volumeUp} key="volume-up">
                              <Icon name={"volume-up"} size="2x" />
                            </Button>,
                            <Button bsSize="lg" bsStyle="danger" onClick={this.skipBreak} key="step-forward">
                              <Icon name={"step-forward"} size="2x" />
                            </Button>
                        ]
                      ):(
                        [
                            <Button bsSize="lg" bsStyle={this.state.workTimeRunning?"warning":"success"} onClick={this.playPauseTimer} key="play-pause">
                              <Icon name={this.state.workTimeRunning?"pause":"play"} size="2x" />
                            </Button>,
                            <Button bsSize="lg" bsStyle="danger" disabled={this.state.workTimeRunning?false:true} onClick={()=>{
                              this.stopTimer('work');
                              this.stopTimer('break');
                            }} key="stop-btn">
                              <Icon name="stop" size="2x" />
                            </Button>
                        ]
                      )
                    }
                </div>
              </div>
  					</header>
  				</div>
	      </div>
      </div>
    );
  }
}
