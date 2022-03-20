"use strict"
define(['base/js/namespace', 'base/js/events'], 
function(Jupyter, events) 
{
    let token = '';
    let url = 'http://localhost:8000/api';
    let loadingtemplate = 
    `<img src="https://cdn.dribbble.com/users/225707/screenshots/2958729/jelly-fluid-loader.gif"\n` +
    `    alt="Loading..." width="10%" height="10%">\n` +
    `<p> Please wait. You will receive an answer soon... </p>`;

    let callCodeOwl = async function() 
    {
        let cellOutput = Jupyter.notebook.
            get_selected_cell().output_area.outputs[0];
        let code = '';
        for (let i = 0; i < code.length; ++i) 
        { 
            cell = Jupyter.notebook.get_cells()[i]
            code += cell + '\n';
            if (cell == Jupyter.notebook.get_selected_cell())
                break;
        }
        if (cellOutput.output_type == 'error')
        {
            Jupyter.notebook.insert_cell_below();
            Jupyter.notebook.select_next();
            Jupyter.notebook.to_markdown();
            let cell = Jupyter.notebook.get_selected_cell();
            cell.set_text(loadingtemplate);
            cell.execute();
            let response = await fetch(url, 
            {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {"token": token, 
                        "traceback": cellOutput.traceback.join(''),
                            "code": code})
            });
            let solution = await response.text();
            cell.set_text(solution);
            cell.execute();
        }
    };

    let codeOwlButton = function () 
    {
        Jupyter.toolbar.add_buttons_group
        ([
            Jupyter.keyboard_manager.actions.register ({
                'help': 'CodeOwl',
                'icon' : 'fa-play-circle',
                'handler': callCodeOwl
            },  'codeowl', 'CodeOwl')
        ])
        if (!Jupyter.keyboard_manager.command_shortcuts.
                    _shortcuts.hasOwnProperty('ctrl-q'))
        {
            Jupyter.keyboard_manager.command_shortcuts.add_shortcut('Ctrl-Q',
                'CodeOwl:codeowl');
        }
    }

    async function load_ipython_extension() 
    {
        codeOwlButton();
        let loader = await fetch('codeowl');
        if (loader.ok) token = await loader.text();
        
        loader = await fetch('codeowl_debug_url');
        if (loader.ok) url = await loader.text();
    }

    return { load_ipython_extension: load_ipython_extension };
});