"use strict"
define(['base/js/namespace', 'base/js/events'], 
function(Jupyter, events) 
{
    let token = '';
    let url = 'http://4k3skl.keenetic.pro/api/';
    let loadingtemplate = 
    `<img src="https://upload.wikimedia.org/wikipedia/commons/2/28/InternetSlowdown_Day.gif"\n` +
    `    alt="Loading..." width="10%" height="10%">\n` +
    `<p> Please wait. You will receive an answer soon... </p>\n`;

    let callAurora = async function() 
    {
        let cellOutput = Jupyter.notebook.
            get_selected_cell().output_area.outputs[0];
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
                        "traceback": cellOutput.traceback.join('')})
            });
            let solution = await response.text();
            cell.set_text(solution);
            cell.execute();
        }
    };

    let auroraAssistantButton = function () 
    {
        Jupyter.toolbar.add_buttons_group
        ([
            Jupyter.keyboard_manager.actions.register ({
                'help': 'Call AuroraAsssistant',
                'icon' : 'fa-play-circle',
                'handler': callAurora
            },  'call-auroraassistant', 'AuroraAssistant')
        ])
        if (!Jupyter.keyboard_manager.command_shortcuts.
                    _shortcuts.hasOwnProperty('ctrl-q'))
        {
            Jupyter.keyboard_manager.command_shortcuts.add_shortcut('Ctrl-Q',
                'AuroraAssistant:call-auroraassistant');
        }
    }

    async function load_ipython_extension() 
    {
        auroraAssistantButton();
        let loader = await fetch('auroraassistant');
        if (loader.ok) token = await loader.text();
        
        loader = await fetch('auroraassistant_debug_url');
        if (loader.ok) url = await loader.text();
        console.log(token)
    }

    return { load_ipython_extension: load_ipython_extension };
});