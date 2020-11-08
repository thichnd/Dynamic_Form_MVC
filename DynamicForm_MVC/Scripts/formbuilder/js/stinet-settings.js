$(document).ready(function () {
    $('#url').hide();
    compileTemplates();
    setup_draggable();
    /*
    $("#n-columns").on("change", function () {
        var v = $(this).val();
        if (v === "1") {
            var $col = $('.form-body .col-md-12').toggle(true);
            $('.form-body .col-md-6 .draggable').each(function (i, el) {
                $(this).remove().appendTo($col);
            });
            $('.form-body .col-md-6').toggle(false);
        } else {
            var $col = $('.form-body .col-md-6').toggle(true);
            $(".form-body .col-md-12 .draggable").each(function (i, el) {
                $(this).remove().appendTo(i % 2 ? $col[1] : $col[0]);
            });
            $('.form-body .col-md-12').toggle(false);
        }
    });
    */

    $("#view-html").on("click", function () {
        var $copy = $(".form-body").parent().clone().appendTo(document.body);
        $copy.find(".tools, div:hidden, .help-block").remove();
        $.each(["draggable", "droppable", "sortable", "dropped",
                "ui-sortable", "ui-draggable", "ui-droppable", "form-body"], function (i, c) {
                    $copy.find("." + c).removeClass(c);
                });
        var html = html_beautify($copy.html());
        $copy.remove();

        $modal = get_modal(html).modal("show");
        $modal.find(".btn").remove();
        $modal.find(".modal-title").html("Copy HTML");
        $modal.find(":input:first").select().focus();

        return false;
    });

    $("#preview-data").on("click", function () {
        var $copy = $(".form-body").parent().clone().appendTo(document.body);
        console.log($copy);
        $copy.find(".tools, div:hidden, p, .help-block").remove();
        $.each(["draggable", "droppable", "sortable", "dropped",
                "ui-sortable", "ui-draggable", "ui-droppable", "form-body"], function (i, c) {
                    $copy.find("." + c).removeClass(c);
                });
        var html = html_beautify($copy.html());
        $copy.remove();

        $modal = get_preview(html).modal("show");
        $modal.find(".btn").remove();
        $modal.find(".modal-title").html("Xem trước");
        $modal.find(":input:first").select().focus();

        return false;
    });

    $('#clear-data').on("click", function () {
        var fields = $('.remove-link');
        if (fields.length) {
            new PNotify({
                title: 'Cảnh báo',
                text: 'Bạn có chắc xóa tất cả các trường?',
                icon: 'glyphicon glyphicon-question-sign',
                hide: false,
                confirm: {
                    confirm: true
                },
                buttons: {
                    closer: false,
                    sticker: false
                },
                history: {
                    history: false
                },
                addclass: 'stack-modal',
                stack: { 'dir1': 'down', 'dir2': 'right', 'modal': true }
            }).get().on('pnotify.confirm', function () {
                fields.parent().parent().remove();
                removeParamUrl();
                //location.reload();
            }).on('pnotify.cancel', function () {
                return false;
            });
        } else {
            alert_msg('Cảnh báo', 'Không có trường để xóa');
        }
        return false;
    });

    $('#btnCopy').on("click", function (event) {
        event.preventDefault();
        var val = $('#txtLink').val();
        copyToClipboard(val, true, "Đã sao chép");
        return false;
    });

    $('#back-to-list').on("click", function () {
        var url = window.location.host == "localhost:8008" ? "/Views/Pages/Commons/frmBuilder_Lst.aspx" : "/Pages/Builder_Lst.aspx";
        window.location.href = url;
        return false;
    });
});

function updateURL(param) {
    if (history.pushState) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?val=' + param;
        window.history.pushState({ path: newurl }, '', newurl);
    }
}

function removeParamUrl() {
    if (history.pushState) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.pushState({ path: newurl }, '', newurl);
    }
}

function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function setup_draggable() {
    $(".draggable").draggable({
        appendTo: "body",
        helper: "clone"
    });
    $(".droppable").droppable({
        accept: ".draggable",
        helper: "clone",
        hoverClass: "droppable-active",
        drop: function (event, ui) {
            $(".empty-form").remove();
            var $orig = $(ui.draggable);
            if (!$(ui.draggable).hasClass("dropped")) {
                var $el = $orig
                    .clone()
                    .addClass("dropped")
                    .css({ "position": "static", "left": null, "right": null })
                    .appendTo(this);

                var divid = $orig.attr("id");
                if (divid) {
                    divid = divid.split("-").slice(0, -1).join("-") + "-" + ((parseInt(divid.split("-").slice(-1)[0]) + 1));
                    $orig.attr("id", divid);
                }

                var id = $orig.find(":input").attr("id");
                if (id) {
                    id = id.split("-").slice(0, -1).join("-") + "-" + ((parseInt(id.split("-").slice(-1)[0]) + 1));
                    $orig.find(":input").attr("id", id);
                    $orig.find("label").attr("for", id);
                }
                var idLabel = $orig.find("label").attr("id");
                if (idLabel) {
                    idLabel = idLabel.split("-").slice(0, -1).join("-") + "-" + ((parseInt(idLabel.split("-").slice(-1)[0]) + 1));
                    $orig.find("label").attr("id", idLabel);
                }
                //$('<p class="tools">\
				//		<a class="edit-link">Sửa<a> | \
				//		<a class="remove-link">Xóa</a></p>').appendTo($el);
                showChangeValue();
            } else {
                if ($(this)[0] != $orig.parent()[0]) {
                    var $el = $orig
                        .clone()
                        .css({ "position": "static", "left": null, "right": null })
                        .appendTo(this);
                    $orig.remove();
                }
            }
        }
    }).sortable();
};

function showChangeValue() {
    $(".add-rows .tools").removeClass('hidden');
}

var load_html = function (html) {
    $(".empty-form").remove();
    var droppable = $('.form-body .col-md-6');
    $('#temp').append($(html));

    $('#temp').find('.col-md-6').each(function (i, obj) {
        $(obj).find('.ui-draggable-handle').each(function (j, drop) {
            var $orig = $(drop);
            var $el = $orig
                        .clone()
                        .addClass("draggable")
                        .addClass("dropped")
                        .css({ "position": "static", "left": null, "right": null })
                        .appendTo(droppable[i]);

            var divid = $orig.attr("id");
            if (divid) {
                divid = divid.split("-").slice(0, -1).join("-") + "-"
                    + (parseInt(divid.split("-").slice(-1)[0]) + 1);
                $orig.attr("id", divid);
            }

            var id = $orig.find(":input").attr("id");

            if (id) {
                id = id.split("-").slice(0, -1).join("-") + "-"
                    + (parseInt(id.split("-").slice(-1)[0]) + 1);

                $orig.find(":input").attr("id", id);
                $orig.find("label").attr("for", id);
            }

            $('<p class="tools">\
        					<a class="edit-link">Sửa<a> | \
        					<a class="remove-link">Xóa</a></p>').appendTo($el);

        });
    });

    $('#temp').remove();
};

var get_modal = function (content) {
    var modal = $('<div class="modal" style="overflow: auto;" tabindex="-1">\
			<div class="modal-dialog">\
				<div class="modal-content">\
					<div class="modal-header">\
						<a type="button" class="close"\
							data-dismiss="modal" aria-hidden="true">&times;</a>\
						<h4 class="modal-title">Sửa HTML</h4>\
					</div>\
					<div class="modal-body ui-front">\
						<div class="form-control" \
							style="min-height: 200px; margin-bottom: 10px;\
							font-family: Monaco, Fixed">' + content + '</div>\
						<button class="btn btn-success">Cập nhật</button>\
					</div>\
				</div>\
			</div>\
			</div>').appendTo(document.body);

    return modal;
};

var get_preview = function (content) {
    var modal = $('<div class="modal" style="overflow: auto;" tabindex="-1">\
			<div class="modal-dialog">\
				<div class="modal-content">\
					<div class="modal-header">\
						<a type="button" class="close"\
							data-dismiss="modal" aria-hidden="true">&times;</a>\
						<h4 class="modal-title">Xem trước</h4>\
					</div>\
					<div class="modal-body ui-front">\
						<div class="form-control" \
							style="min-height: 200px; margin-bottom: 10px;\
							font-family: Monaco, Fixed">' + content + '</div>\
						<button class="btn btn-success">Cập nhật</button>\
					</div>\
				</div>\
			</div>\
			</div>').appendTo(document.body);

    return modal;
};





$(document).on("click", ".edit-link", function (ev) {
    var ctrlType;
    var $el = $(this).parent().parent().parent();
    var $el_copy = $el.clone();
    var ctrl = $el_copy.find("[class*=ctrl]")[0];
    if (ctrl != undefined)
        ctrlType = $.trim(ctrl.className.match("ctrl-.*")[0].split(" ")[0].split("-")[1]);
    else {
        var ctrlable = $el_copy.find("[class*=control]")[0];
        ctrlType = $.trim(ctrlable.className.match("control-.*")[0].split(" ")[0].split("-")[1]);
    }
    var id = $el_copy.attr("id");
    customize_ctrl(ctrlType, id);

    return false;
});

$(document).on("click", ".remove-link", function (ev) {
    $(this).parent().parent().parent().remove();
});

var copyToClipboard = function copyToClipboard(value, showNotification, notificationText) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(value).select();
    document.execCommand("copy");
    $temp.remove();

    if (typeof showNotification === 'undefined') {
        showNotification = true;
    }
    if (typeof notificationText === 'undefined') {
        notificationText = "Copied to clipboard";
    }

    var notificationTag = $("div.copy-notification");
    if (showNotification && notificationTag.length == 0) {
        notificationTag = $("<div/>", { "class": "copy-notification", text: notificationText });
        $("body").append(notificationTag);

        notificationTag.fadeIn("slow", function () {
            setTimeout(function () {
                notificationTag.fadeOut("slow", function () {
                    notificationTag.remove();
                });
            }, 1000);
        });
    }
};

var compileTemplates = function () {
    window.templates = {};
    window.templates.common = Handlebars.compile($("#control-customize-template").html());
    window.templates.textbox = Handlebars.compile($("#textbox-template").html());
    window.templates.passwordbox = Handlebars.compile($("#textbox-template").html());
    window.templates.combobox = Handlebars.compile($("#combobox-template").html());
    window.templates.selectmultiplelist = Handlebars.compile($("#combobox-template").html());
    window.templates.radiogroup = Handlebars.compile($("#combobox-template").html());
    window.templates.checkboxgroup = Handlebars.compile($("#combobox-template").html());
    window.templates.label = Handlebars.compile($("#label-template").html());
};

var customize_ctrl = function (ctrlType, ctrlID) {
    console.log(ctrlType);

    var ctrlParams = {};
    var specificTemplate = templates[ctrlType];
    if (typeof (specificTemplate) == 'undefined') {
        specificTemplate = function () { return ''; };
    }

    var modalHeader = $("#" + ctrlID).find('.control-label').text();

    var templateParams = {
        header: modalHeader,
        content: specificTemplate(ctrlParams),
        type: ctrlType,
        forCtrl: ctrlID
    };
    var s = templates.common(templateParams) + "";
    $("[name=customization_modal]").remove();
    $('<div id="customization_modal" name="customization_modal" class="modal" />').append(s).modal('show');
    var classname;
    var clasnameoffset = "";
    var classNames = $('#' + ctrlID + ' #col-change').attr('class').toString().split(' ');
    $.each(classNames, function (i, className) {
        if (i == 0)
            classname = className;
        else 
            clasnameoffset = className;
    });
    $('#addCol').val(classname);
    $('#addColOffset').val(clasnameoffset);
    setTimeout(function () {
        load_values.common(ctrlType, ctrlID);
    }, 300);
};

var save_customize_changes = function (e, obj) {
    //console.log('save clicked', arguments);
    var formValues = {};
    var val = null;
    $("#theForm").find("input, textarea").each(function (i, o) {
        if (o.type == "checkbox") {
            val = o.checked;
        } else {
            val = o.value;
        }
        formValues[o.name] = val;
    });
    save_changes.common(formValues);
};

load_values = {};
save_changes = {};

load_values.common = function (ctrlType, ctrlID) {
    var form = $("#theForm");
    var divCtrl = $("#" + ctrlID);
    
    form.find("[name=label]").val(divCtrl.find('.control-label').text());
    var specificLoadMethod = load_values[ctrlType];
    if (typeof (specificLoadMethod) != 'undefined') {
        specificLoadMethod(ctrlType, ctrlID);
    }
};

load_values.textbox = function (ctrlType, ctrlID) {
    var form = $("#theForm");
    var divCtrl = $("#" + ctrlID);
    var ctrl = divCtrl.find("input")[0];
    form.find("[name=name]").val(ctrl.name);
    form.find("[name=placeholder]").val(ctrl.placeholder);
};

load_values.textarea =  function (ctrlType, ctrlID) {
    var form = $("#theForm");
    var divCtrl = $("#" + ctrlID);
    var ctrl = divCtrl.find("textarea")[0];
    form.find("[name=name]").val(ctrl.name);
    form.find("[name=placeholder]").val(ctrl.placeholder);
};

load_values.combobox = function (ctrlType, ctrlID) {
    var form = $("#theForm");
    var divCtrl = $("#" + ctrlID);
    var ctrl = divCtrl.find("select")[0];
    form.find("[name=name]").val(ctrl.name);
    var options = '';
    $(ctrl).find('option').each(function (i, o) { options += o.text + '\n'; });
    form.find("[name=options]").val($.trim(options));
};

save_changes.common = function (values) {
    console.log(values);
    var col = $('#addCol').val();
    var colOffset = $('#addColOffset').val();
    $(".add-rows #" + values.forCtrl + " #col-change").removeClass().addClass(col).addClass(colOffset);
    var divCtrl = $("#" + values.forCtrl);

    divCtrl.find('.control-label').text(values.label);
    var specificSaveMethod = save_changes[values.type];
    if (typeof (specificSaveMethod) != 'undefined') {
        specificSaveMethod(values);
    }
};

save_changes.textbox = function (values) {
    var divCtrl = $("#" + values.forCtrl);
    var ctrl = divCtrl.find("input")[0];
    console.log(ctrl);
    ctrl.placeholder = values.placeholder;
    ctrl.name = values.name;
};

save_changes.combobox = function (values) {
    console.log(values);
    var divCtrl = $("#" + values.forCtrl);
    var ctrl = divCtrl.find("select")[0];
    ctrl.name = values.name;
    $(ctrl).empty();
    $(values.options.split('\n')).each(function (i, o) {
        $(ctrl).append("<option>" + $.trim(o) + "</option>");
    });
};

function selectCol(val) {
    $(".col-change input:checkbox").prop('checked', false);
    $('#' + val).prop('checked', true);
}
var indexRow = 1;
function addRow() {
    $('.add-rows').append('<div class="form-horizontal ' + indexRow + '-row"><div class="form-group"> <div id="' + indexRow + '" title="Drag drop control.." class="col-md-12 ' + indexRow + '-row droppable sortable"></div></div><p class="' + indexRow + '-row delete-row" title="Delete row" onclick="removeRow(\'' + indexRow + '-row\')"><span class="glyphicon glyphicon-remove"></span></p></div>');
    indexRow++;
    setup_draggable();
}
function removeRow(val) {
    $('.' + val).remove();
}
function changeCol() {
    $modal = change_col(html).modal("show");
    $modal.find(".btn").remove();
    $modal.find(".modal-title").html("Change col");
    $modal.find(":input:first").select().focus();
};
function showCol() {
    for (var i = 1; i < 13; i++) {
        var opt = document.createElement('option');
        opt.value = 'col-md-' + i;
        opt.innerHTML = i + ' cột';
        $('#addCol').append(opt);
    }
    $("#addCol").val('col-md-12');
}