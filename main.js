/**
 * Created by Mohammad Tanveer on 21-05-17.
 */
define(function (require, exports, module) {
    "use strict";

    var CommandManager = app.getModule("command/CommandManager"),
        DefaultMenus = app.getModule("menu/DefaultMenus"),
        ContextMenuManager = app.getModule("menu/ContextMenuManager"),
        ModelExplorerView = app.getModule("explorer/ModelExplorerView"),
        DiagramManager = app.getModule("diagrams/DiagramManager"),
        ProjectManager = app.getModule("engine/ProjectManager"),
        Repository = app.getModule('core/Repository'),
        SelectionManager = app.getModule('engine/SelectionManager'),
        Dialogs = app.getModule('dialogs/Dialogs'),
        Factory = app.getModule("engine/Factory"),
        Engine = app.getModule("engine/Engine"),
        ElementListPickerDialog = app.getModule('dialogs/ElementListPickerDialog');


    // Define commands
    var CMD_REFACTOR = "myextension.refactor",
        CMD_REFACTOR_RENAME = "myextension.refactor.rename";

    // Register commands
    CommandManager.register("Refactor", CMD_REFACTOR, CommandManager.doNothing);

    CommandManager.register("Rename", CMD_REFACTOR_RENAME, function () {
        if (modelElements.length != 1) {
            alert("Please select one element for rename");
        }
        else if (modelElements[0] != undefined) {
            var dlg = Dialogs.showInputDialog("Enter new name.", modelElements[0].name);
            dlg.done(function (buttonId, text) {
                if (buttonId === Dialogs.DIALOG_BTN_OK) {
                    console.log("New name is", text);
                    if (text.trim() == "") {
                        alert("Please enter a valid name");
                    }
                    else {
                        Engine.setProperty(modelElements[0], "name", text);
                        reset();
                    }
                }
            });
        }
    });

    // Reset the view and savepost running command
    function reset() {
        var filePath = ProjectManager.getFilename();
        ProjectManager.save(filePath);
        SelectionManager.deselectAll();
        DiagramManager.repaint();
        ModelExplorerView.rebuild();
        var project = ProjectManager.getProject();
        ModelExplorerView.expand(project);
        ModelExplorerView.expand(project.ownedElements[0]);
    }

    // Get the Context Menu of Diagram area
    var contextMenu = ContextMenuManager.getContextMenu(DefaultMenus.contextMenus.DIAGRAM);

    // Add Refactor menu item to the Context Menu
    var topLevelMenu = contextMenu.addMenuItem(CMD_REFACTOR);

    // Add refactoring methods menu items
    topLevelMenu.addMenuItem(CMD_REFACTOR_RENAME);

    var modelElements;

    // Enable/disable command on selection
    $(SelectionManager).on('selectionChanged', function (evt, models, views) {

        var refactor = CommandManager.get(CMD_REFACTOR);
        var rename = CommandManager.get(CMD_REFACTOR_RENAME);

        modelElements = models;

        if (models.length == 0) {
            refactor.setEnabled(false);
        }
        else {
            refactor.setEnabled(true);

            if (models.length == 1) {

                rename.setEnabled(true);
            }
            else {
                rename.setEnabled(false);
            }
        }
    });
});