"use strict"
define(['base/js/namespace', 'base/js/events'], 
function(Jupyter, events) 
{
    let lastWindow;
    let token = '';
    let url = 'http://localhost:8000/';
    let loadingtemplate = 
    `<img src="https://downloader.disk.yandex.ru/preview/d59f6173214890cc2e365e69a8117f0f14dff4fd317e4fa2335c2da98a069023/623766e7/8umrP0U9lF0YtRWsYHcPhBlzbGfmcnKP50OK0V8zMwtBYbA0i1TciwNoCCN6yeA7eHhZVPLjAxTGVFEDB828_g%3D%3D?uid=0&filename=loading.gif&disposition=inline&hash=&limit=0&content_type=image%2Fgif&owner_uid=0&tknv=v2&size=2048x2048"\n` +
    `    alt="Loading..." width="10%" height="10%">\n` +
    `<p> Please wait. You will receive an answer soon... </p>`;

    let callCodeOwl = async function(check=true)
    {
        let cellOutput = Jupyter.notebook.
            get_selected_cell().output_area.outputs[0];
        let code = '';
        for (let i = 0; i < Jupyter.notebook.get_cells().length; ++i) 
        { 
            let cell = Jupyter.notebook.get_cells()[i];
            code += cell.get_text() + '\n';
            if (cell == Jupyter.notebook.get_selected_cell())
                break;
        }
        if (cellOutput.output_type == 'error')
        {
            if (check)
            {
                let check = await checkToken();
                if (!check) return;
            }
            Jupyter.notebook.insert_cell_below();
            Jupyter.notebook.select_next();
            Jupyter.notebook.to_markdown();
            let cell = Jupyter.notebook.get_selected_cell();
            cell.set_text(loadingtemplate);
            cell.execute();
            let response = await fetch(url + 'api/', 
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

    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    let checkToken = async function()
    {
        token = getCookie('codeowl');
        let response = await fetch(url + 'validate/', 
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"token": token})
        });
        if (response.ok) return true;
        lastWindow = window.open(url + 'accounts/login/');
        return false;
    }

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

    let load_ipython_extension = async function() 
    {
        codeOwlButton();
        // let loader = await fetch('codeowl');
        // if (loader.ok) token = await loader.text();

        window.addEventListener("message", function(event) 
        {
            if (event.origin + '/' == url)
            {
                document.cookie = "codeowl=" + event.data + "; max-age:1800";
                token = event.data;
                callCodeOwl(false);
                lastWindow.close();
            }
        });  
        
        let loader = await fetch('codeowl_debug_url');
        if (loader.ok) url = await loader.text();
    }

    return { load_ipython_extension: load_ipython_extension };
});