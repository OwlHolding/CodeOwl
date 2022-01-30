"use strict"
define(['base/js/namespace', 'base/js/events'], 
function(Jupyter, events) 
{
    let token = 'testtoken';
    let url = 'https://localhost:44384/api/test';

    let callAurora = function() 
    {
        Jupyter.notebook.insert_cell_above('code').set_text('Its work!!!');
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
    }

    async function load_ipython_extension() 
    {
        auroraAssistantButton();
        let loader = await fetch('auroraassistant');
        if (loader.ok) token = await loader.text();
        
        loader = await fetch('aurorassitant_debug_url');
        if (loader.ok) url = await loader.text();
        console.log(token)
    }

    return { load_ipython_extension: load_ipython_extension };
});