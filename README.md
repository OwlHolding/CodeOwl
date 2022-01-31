# Aurora Assistant

### About
Your personal assistant based on artificial intelligence. Aurora analyzes error traceback in machine learning libraries and proposes a optimal fix.

### Requirement
To use Aurora Assistant on your hardware you need:
- Python >= 3.6
- Jupyter Notebook >= 3.x
- Jupyter Nbextensions

You can also use the web version of the assistant.

### Installation

Download the repository and open a terminal in the "AuroraAssistant" folder. Run the commands:
```
jupyter nbextension install src/auroraassistant
jupyter nbextension enable auroraassistant/main
```

### How to add a token
Download the token from the [official site](http://4k3skl.keenetic.pro) and place it in the working folder of Jupyter Notebook.

<img src="https://ie.wampi.ru/2022/01/31/AuroraAssistant-2.png" alt="auroraassistant in working directory" border="0">

### Usage
Select the cell with the error and turn on the command mode using "Esc". Press Ctrl + Q and wait for the solution to be generated.
