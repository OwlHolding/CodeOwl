"use strict"
define(['base/js/namespace', 'base/js/events'], 
function(Jupyter, events) 
{
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

    function load_ipython_extension() 
    {
        auroraAssistantButton();
    }
    return { load_ipython_extension: load_ipython_extension };
});