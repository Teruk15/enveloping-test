let window_size = 50; // Arbitray: decided based on smoothness of signal
let kernel = 1 / window_size; // Have "better" kernel?

let buffer = [];

// Fill the buffer
for (let i = 0; i < window_size; ++i) {
    buffer.push(0);
}

// Same as moving average
function convolution(new_signal: number, buffer: number[]){
    // Update the buffer
    buffer.shift()
    buffer.push(new_signal)

    // Perform the convolution(dot product of buffer and "kernel")
    let result = 0.0;

    // If this is working fine, optimization can happen here
    for (let i = 0; i < window_size; ++i){
        result += buffer[i] * kernel;
    }

    return result
}

// Main
const down_sample_fs = 500;
const period = 1000000 / down_sample_fs;
let elapsed_time = 0;

let signal = 0;
let result = 0;

let sample_time = input.runningTimeMicros();
while (true) {
    // Obtain the signal + make baseline to be 0
    signal = pins.analogReadPin(AnalogPin.P0) - 512;
    
    // Rectify the signal
    signal = Math.abs(signal);

    result = convolution(signal, buffer);

    // Serial Out (very laggy)
    // serial.writeValue("Enveloped", result);

    // Data logging (best for visualization)
    // datalogger.log(datalogger.createCV("EMG", result));

    // Sampling Rate caluculation
    elapsed_time = input.runningTimeMicros() - sample_time;

    if (elapsed_time < period) {
        control.waitMicros(period - elapsed_time);
    }

    sample_time = input.runningTimeMicros();
}