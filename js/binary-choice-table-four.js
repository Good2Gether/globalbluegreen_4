var jsPsychBinaryChoiceTableFour = (function (jspsych) {
  "use strict";

  const info = {
    name: "binary-choice-table-four",
    parameters: {
      stimulus: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name: 'stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      choices: {
        type: jspsych.ParameterType.KEYCODE,
        array: true,
        pretty_name: 'choices',
        default: ['F', 'J'], //jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      timing_response: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'timing_response',
        default: 0,
        description: 'timing_response.'
      },
      doEyeTracking: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'eye-tracking',
        default: true,
        description: 'Whether to do the eye tracking during this trial.'
      },
      realOrPrac: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'eye-tracking',
        default: true,
        description: 'Whether it is a real choice, real- true'
      }, 
            /**
       * How long to show the stimulus.
       */
      stimulus_duration: {
          type: jspsych.ParameterType.INT,
          pretty_name: "Stimulus duration",
          default: null,
      },
      /**
       * How long to show trial before it ends.
       */
      trial_duration: {
          type: jspsych.ParameterType.INT,
          pretty_name: "Trial duration",
          default: null,
      },
      /**
       * If true, trial will end when subject makes a response.
       */
      response_ends_trial: {
          type: jspsych.ParameterType.BOOL,
          pretty_name: "Response ends trial",
          default: true,
      },
      
      },
  };

  /**
   * **binary-choice-table**
   *
   * SHORT PLUGIN DESCRIPTION
   *
   * @author YOUR NAME
   * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
   */
  class BinaryChoiceTableFourPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {



      // set default values for the parameters
      trial.choices = trial.choices || [];
      //trial.timing_stim = trial.timing_stim || -1;
      trial.timing_response = trial.timing_response || -1;
      var keyboardListener;
    
      var response = {
        rt: -1,
        key: -1
      };
      console.log("in_trial: ", this);
      // this.jsPsych.extensions.webgazer.showPredictions();
      // this.jsPsych.extensions.webgazer.resume();
      
      // display stimuli

      
        // console.log('!!! display_stage');
        console.log(trial.stimulus['o1']);
        console.log("this: ",this);

        display_element.innerHTML = '';
        // var new_html = '';
        var table_stimulus =  ` <div id="div-table" style="margin: auto;">
        <table class="b" style= "table-layout: fixed;
          border-collapse: collapse;
          border-style: hidden;
          ">
          <colgroup>
              <col span="1" style="width: 20%;">
            
              <col span="1" style="width: 30%;">
              <col span="1" style="width: 30%; border-left: 2px white solid;">
              <col span="1" style="width: 20%;">
          </colgroup>
          <tr>
      
          <th></th>
          <th style="vertical-align: top; height: 50px;">Option A</th>
          <th style="vertical-align: top;">Option B</th>
          </tr>
          <tr style="vertical-align: center;">
              <td style="text-align: left;">You receive</td>
              <td style="text-align: center;" id="up-left">${trial.stimulus['s1'].toFixed(1)} </td>
              <td style="text-align: center;">${trial.stimulus['s2'].toFixed(1)}</td>
              <td></td>
          </tr>
          <tr style="vertical-align: center;">
              <td style="text-align: left;">The other player receives</td>
              <td style="text-align: center;"> ${trial.stimulus['o1'].toFixed(1)}</td>     
              <td style="text-align: center;" id="bottom-right"> ${trial.stimulus['o2'].toFixed(1)} </td>
              <td></td>
          </tr>
        
          </table>
  
        </div>
      `;
        var new_html = '<div id="jspsych-html-keyboard-response-stimulus">' + table_stimulus + "</div>";
          
      // add prompt
      // if (trial.prompt !== null) {
      //     new_html += trial.prompt;
      // }
      // // draw
      display_element.innerHTML = new_html;
      // store response
      var response = {
          rt: null,
          key: null,
      };

      // turn on webgazer's loop
      console.log("in trial before", this);
      console.log("in trial web", this.jsPsych.extensions.webgazer.isInitialized());
      // this.jsPsych.extensions.webgazer.isInitialized();
      // this.jsPsych.extensions.webgazer.showPredictions();
      // this.jsPsych.extensions.webgazer.resume();
      
      // this.jsPsych.extensions.webgazer.showPredictions();

      // this.jsPsych.extensions.webgazer.stopSampleInterval();
      // this.jsPsych.extensions.webgazer.resume();

      // function to end trial when it is time
      const end_trial = () => {
          // kill any remaining setTimeout handlers
          this.jsPsych.pluginAPI.clearAllTimeouts();
          // kill keyboard listeners
          if (typeof keyboardListener !== "undefined") {
              this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
          }
          // gather the data to store for the trial
          // var trial_data = {
          //     rt: response.rt,
          //     stimulus: trial.stimulus,
          //     response: response.key,
          // };
          var trial_data = {
            stimulus: trial.stimulus,
            rt: response.rt,
            key_press: response.key,
            choices: trial.choices,
            realtrial:  trial.realOrPrac
          };
          console.log("in end binary: ", this);
  
          // clear the display
          display_element.innerHTML = "";
          // move on to the next trial
          this.jsPsych.finishTrial(trial_data);
      };
      // function to handle responses by the subject
      var after_response = (info) => {
          // after a valid response, the stimulus will have the CSS class 'responded'
          // which can be used to provide visual feedback that a response was recorded
          display_element.querySelector("#jspsych-html-keyboard-response-stimulus").className +=
              " responded";
          // only record the first response
          if (response.key == null) {
              response = info;
          }
          if (trial.response_ends_trial) {
              end_trial();
          }
      };
      // start the response listener
      if (trial.choices != "NO_KEYS") {
          var keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
              callback_function: after_response,
              valid_responses: trial.choices,
              rt_method: "performance",
              persist: false,
              allow_held_key: false,
          });
      }
      // hide stimulus if stimulus_duration is set
      if (trial.stimulus_duration !== null) {
          this.jsPsych.pluginAPI.setTimeout(() => {
              display_element.querySelector("#jspsych-html-keyboard-response-stimulus").style.visibility = "hidden";
          }, trial.stimulus_duration);
      }
      // end trial if trial_duration is set
      if (trial.trial_duration !== null) {
          this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration);
      }

  

    }
  }
  BinaryChoiceTableFourPlugin.info = info;

  return BinaryChoiceTableFourPlugin;
})(jsPsychModule);


