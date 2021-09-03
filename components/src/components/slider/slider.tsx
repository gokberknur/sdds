import { Component, h, State, Listen, Prop } from '@stencil/core';

@Component({
  tag: 'sdds-slider',
  styleUrl: 'slider.scss',
  shadow: true
})
export class Slider {
  @Prop() type: string;
  @Prop() min: string = '0';
  @Prop() max: string = '200';
  @Prop() value: string = '100';
  @Prop() value2: string = '200';
  spantext!: HTMLInputElement;

  leftRangeInputEl!: HTMLInputElement;
  rightRangeInputEl!: HTMLInputElement;

  leftInputTextRef!: HTMLInputElement;
  rightInputTextRef!: HTMLInputElement;

  @State() leftRangeOldValue: string;
  @State() rightRangeOldValue: string;

  @State() rangeStyle = {
    '--min': this.min,
    '--max': this.max,
    '--val': this.value
  };

  @State() secondRangeStyle = {
    '--min': this.min,
    '--max': this.max,
    '--val': this.value2
  };

  private handleOnClickPlus = () => {
    parseInt(this.rangeStyle['--val']) < parseInt(this.rangeStyle['--max'])
      ? this.updateValue(this.leftRangeInputEl.valueAsNumber + 1)
      : '';
  };

  private handleOnClickMinus = () => {
    parseInt(this.rangeStyle['--val']) > parseInt(this.rangeStyle['--min'])
      ? this.updateValue(this.leftRangeInputEl.valueAsNumber - 1)
      : '';
  };

  private handleOnChangeLeft = (event) => {
    this.onInputTextChange(event.target.value, this.leftInputTextRef, true);
  };

  private handleOnChangeRight = (event) => {
    this.onInputTextChange(event.target.value, this.rightInputTextRef, false);
  };

  private onInputTextChange(newValue, elemnetRef, leftInput) {
    if (
      parseInt(newValue) >= parseInt(this.rangeStyle['--min']) &&
      parseInt(newValue) <= parseInt(this.rangeStyle['--max'])
    ) {
      elemnetRef.classList.remove('input-text-error');
      leftInput
        ? this.updateValue(
            newValue,
            this.rightRangeInputEl.valueAsNumber,
            elemnetRef
          )
        : this.updateValue(
            this.leftRangeInputEl.valueAsNumber,
            newValue,
            elemnetRef
          );
    } else {
      elemnetRef.classList.add('input-text-error');
    }
  }

  @Listen('input')
  handleChange() {
    this.updateValue(
      this.leftRangeInputEl.valueAsNumber,
      this.rightRangeInputEl?.valueAsNumber
    );
  }

  private updateValue(value: number, value2?: number, elemnetRef?: any) {
    if (this.type === 'basic') {
      this.leftRangeInputEl.value = value.toString();
      this.rangeStyle = { ...this.rangeStyle, '--val': value.toString() };
    } else if (this.type === 'continuousValue') {
      this.spantext.innerHTML = value.toString();
      this.spantext.style.left = value - value * 0.15 + 'px';
      this.leftRangeInputEl.value = value.toString();
      this.rangeStyle = { ...this.rangeStyle, '--val': value.toString() };
    } else if (this.type === 'dualPoint') {
      if (value2 - value > 10) {
        elemnetRef?.classList.remove('input-text-error');
        this.leftRangeInputEl.value = value.toString(); // update the left input incase change ot not
        this.rightRangeInputEl.value = value2.toString(); // update the right input incase change ot not
        this.rangeStyle = { ...this.rangeStyle, '--val': value.toString() }; // update left range incase change ot not
        this.secondRangeStyle = {
          ...this.secondRangeStyle,
          '--val': value2.toString()
        }; // update right range incase change ot not
        this.leftRangeOldValue = value.toString(); // save old value for fallback
        this.rightRangeOldValue = value2.toString(); // save old value for fallback
      } else {
        // Keep the value as pervious
        this.leftRangeInputEl.value = this.leftRangeOldValue;
        this.rightRangeInputEl.value = this.rightRangeOldValue;
        this.rangeStyle = {
          ...this.rangeStyle,
          '--val': this.leftRangeOldValue
        };
        this.secondRangeStyle = {
          ...this.secondRangeStyle,
          '--val': this.rightRangeOldValue
        };
        elemnetRef?.classList.add('input-text-error');
      }
    }
  }

  inputBasic() {
    return (
      <div style={this.rangeStyle} class="container">
        <input
          style={{ position: 'relative' }}
          value={`${this.rangeStyle['--val']}`}
          ref={(el) => (this.leftRangeInputEl = el as HTMLInputElement)}
          type="range"
        ></input>
      </div>
    );
  }

  inputContinuous() {
    return (
      <div style={this.rangeStyle} class="container">
        <button onClick={this.handleOnClickMinus}>
          {' '}
          <span>-</span>{' '}
        </button>
        <div style={{ height: '15px' }}>
          <input
            value={`${this.rangeStyle['--val']}`}
            ref={(el) => (this.leftRangeInputEl = el as HTMLInputElement)}
            type="range"
          ></input>
          <div class="sliderspan">
            <span
              class="spantext"
              ref={(el) => (this.spantext = el as HTMLInputElement)}
            >
              {this.rangeStyle['--val']}
            </span>
            <span class="spantrianlge"></span>
          </div>
        </div>
        <button onClick={this.handleOnClickPlus}>
          {' '}
          <span>+</span>{' '}
        </button>
      </div>
    );
  }
  dualPoint() {
    return (
      <div class="container">
        <input
          min={`${this.rangeStyle['--min']}`}
          max={`${this.rangeStyle['--max']}`}
          value={`${this.rangeStyle['--val']}`}
          type="text"
          ref={(el) => (this.leftInputTextRef = el as HTMLInputElement)}
          class="input-text"
          onKeyUp={(ev) => this.handleOnChangeLeft(ev)}
        ></input>
        <div
          class="range-slider"
          style={{
            '--minval': `${this.rangeStyle['--val']}`,
            '--maxval': `${this.secondRangeStyle['--val']}`
          }}
        >
          <input
            min={`${this.rangeStyle['--min']}`}
            max={`${this.rangeStyle['--max']}`}
            value={`${this.rangeStyle['--val']}`}
            type="range"
            class="sliders"
            style={this.rangeStyle}
            ref={(el) => (this.leftRangeInputEl = el as HTMLInputElement)}
          ></input>
          <input
            min={`${this.secondRangeStyle['--min']}`}
            max={`${this.secondRangeStyle['--max']}`}
            value={`${this.secondRangeStyle['--val']}`}
            type="range"
            class="sliders"
            ref={(el) => (this.rightRangeInputEl = el as HTMLInputElement)}
            style={this.secondRangeStyle}
          ></input>
        </div>
        <input
          min={`${this.secondRangeStyle['--min']}`}
          max={`${this.secondRangeStyle['--max']}`}
          type="text"
          value={`${this.secondRangeStyle['--val']}`}
          ref={(el) => (this.rightInputTextRef = el as HTMLInputElement)}
          class="input-text"
          onKeyUp={(ev) => this.handleOnChangeRight(ev)}
        ></input>
      </div>
    );
  }

  render() {
    console.log('Range', this.rangeStyle);
    return (
      <div>
        {this.type === 'basic' && this.inputBasic()}
        {this.type === 'continuousValue' && this.inputContinuous()}
        {this.type === 'dualPoint' && this.dualPoint()}
      </div>
    );
  }
}
