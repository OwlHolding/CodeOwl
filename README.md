# CodeOwl

### About
Your personal assistant based on artificial intelligence. CodeOwl analyzes the problematic code and proposes a optimal fix.

### Requirement
To use CodeOwl on your hardware you need:
- Python >= 3.6
- Jupyter Notebook >= 3.x
- Jupyter Nbextensions

### Installation

Download the repository and open a terminal in the "CodeOwl" folder. Run the commands:
```
jupyter nbextension install src/codeowl
jupyter nbextension enable codeowl/main
```

### How to add a token
The token is automatically downloaded from the server if you are logged in to [our site](https://codeowl.pythonanywhere.com/).

### User Replacement
Log out of your account on the [site](https://codeowl.pythonanywhere.com/), then log in to a new one. After a while, the token will be replaced automatically.

### Usage
Select the cell with the error and turn on the command mode using "Esc". Press Ctrl + Q and wait for the solution to be generated.

<br>

<img src="https://ie.wampi.ru/2022/03/21/merge.gif" alt="demo.gif" width="100%" heigth="100%">
