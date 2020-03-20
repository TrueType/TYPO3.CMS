/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */
define(["require","exports","jquery","./Enum/Severity","./Utility/MessageUtility","moment","nprogress","TYPO3/CMS/Core/Ajax/AjaxRequest","./Modal","./Notification"],(function(e,t,i,s,a,o,r,n,l,d){"use strict";var p;Object.defineProperty(t,"__esModule",{value:!0}),function(e){e.OVERRIDE="replace",e.RENAME="rename",e.SKIP="cancel",e.USE_EXISTING="useExisting"}(p||(p={}));class h{constructor(e){this.askForOverride=[],this.percentagePerFile=1,this.hideDropzone=e=>{e.stopPropagation(),e.preventDefault(),this.$dropzone.hide()},this.dragFileIntoDocument=e=>(e.stopPropagation(),e.preventDefault(),i(e.currentTarget).addClass("drop-in-progress"),this.showDropzone(),!1),this.dragAborted=e=>(e.stopPropagation(),e.preventDefault(),i(e.currentTarget).removeClass("drop-in-progress"),!1),this.ignoreDrop=e=>(e.stopPropagation(),e.preventDefault(),this.dragAborted(e),!1),this.handleDrop=e=>{this.ignoreDrop(e),this.processFiles(e.originalEvent.dataTransfer.files),this.$dropzone.removeClass("drop-status-ok")},this.fileInDropzone=()=>{this.$dropzone.addClass("drop-status-ok")},this.fileOutOfDropzone=()=>{this.$dropzone.removeClass("drop-status-ok")},this.$body=i("body"),this.$element=i(e);const t=void 0!==this.$element.data("dropzoneTrigger");this.$trigger=i(this.$element.data("dropzoneTrigger")),this.defaultAction=this.$element.data("defaultAction")||p.SKIP,this.$dropzone=i("<div />").addClass("dropzone").hide(),this.irreObjectUid=this.$element.data("fileIrreObject");const s=this.$element.data("dropzoneTarget");this.irreObjectUid&&0!==this.$element.nextAll(s).length?(this.dropZoneInsertBefore=!0,this.$dropzone.insertBefore(s)):(this.dropZoneInsertBefore=!1,this.$dropzone.insertAfter(s)),this.$dropzoneMask=i("<div />").addClass("dropzone-mask").appendTo(this.$dropzone),this.fileInput=document.createElement("input"),this.fileInput.setAttribute("type","file"),this.fileInput.setAttribute("multiple","multiple"),this.fileInput.setAttribute("name","files[]"),this.fileInput.classList.add("upload-file-picker"),this.$body.append(this.fileInput),this.$fileList=i(this.$element.data("progress-container")),this.fileListColumnCount=i("thead tr:first th",this.$fileList).length,this.filesExtensionsAllowed=this.$element.data("file-allowed"),this.fileDenyPattern=this.$element.data("file-deny-pattern")?new RegExp(this.$element.data("file-deny-pattern"),"i"):null,this.maxFileSize=parseInt(this.$element.data("max-file-size"),10),this.target=this.$element.data("target-folder"),this.browserCapabilities={fileReader:"undefined"!=typeof FileReader,DnD:"draggable"in document.createElement("span"),Progress:"upload"in new XMLHttpRequest},this.browserCapabilities.DnD?(this.$body.on("dragover",this.dragFileIntoDocument),this.$body.on("dragend",this.dragAborted),this.$body.on("drop",this.ignoreDrop),this.$dropzone.on("dragenter",this.fileInDropzone),this.$dropzoneMask.on("dragenter",this.fileInDropzone),this.$dropzoneMask.on("dragleave",this.fileOutOfDropzone),this.$dropzoneMask.on("drop",e=>this.handleDrop(e)),this.$dropzone.prepend('<div class="dropzone-hint"><div class="dropzone-hint-media"><div class="dropzone-hint-icon"></div></div><div class="dropzone-hint-body"><h3 class="dropzone-hint-title">'+TYPO3.lang["file_upload.dropzonehint.title"]+'</h3><p class="dropzone-hint-message">'+TYPO3.lang["file_upload.dropzonehint.message"]+"</p></div></div>").click(()=>{this.fileInput.click()}),i("<span />").addClass("dropzone-close").click(this.hideDropzone).appendTo(this.$dropzone),0===this.$fileList.length&&(this.$fileList=i("<table />").attr("id","typo3-filelist").addClass("table table-striped table-hover upload-queue").html("<tbody></tbody>").hide(),this.dropZoneInsertBefore?this.$fileList.insertAfter(this.$dropzone):this.$fileList.insertBefore(this.$dropzone),this.fileListColumnCount=7),this.fileInput.addEventListener("change",()=>{this.processFiles(Array.apply(null,this.fileInput.files))}),this.bindUploadButton(!0===t?this.$trigger:this.$element)):console.warn("Browser has no Drag and drop capabilities; cannot initialize DragUploader")}showDropzone(){this.$dropzone.show()}processFiles(e){this.queueLength=e.length,this.$fileList.is(":visible")||this.$fileList.show(),r.start(),this.percentagePerFile=1/e.length;const t=[];Array.from(e).forEach(e=>{const i=new n(TYPO3.settings.ajaxUrls.file_exists).withQueryArguments({fileName:e.name,fileTarget:this.target}).get({cache:"no-cache"}).then(async t=>{const i=await t.resolve();void 0!==i.uid?(this.askForOverride.push({original:i,uploaded:e,action:this.irreObjectUid?p.USE_EXISTING:p.SKIP}),r.inc(this.percentagePerFile)):new g(this,e,p.SKIP)});t.push(i)}),Promise.all(t).then(()=>{this.drawOverrideModal(),r.done()}),this.fileInput.value=""}bindUploadButton(e){e.click(e=>{e.preventDefault(),this.fileInput.click(),this.showDropzone()})}decrementQueueLength(){this.queueLength>0&&(this.queueLength--,0===this.queueLength&&new n(TYPO3.settings.ajaxUrls.flashmessages_render).get({cache:"no-cache"}).then(async e=>{const t=await e.resolve();for(let e of t)d.showMessage(e.title,e.message,e.severity)}))}drawOverrideModal(){const e=Object.keys(this.askForOverride).length;if(0===e)return;const t=i("<div/>").append(i("<p/>").text(TYPO3.lang["file_upload.existingfiles.description"]),i("<table/>",{class:"table"}).append(i("<thead/>").append(i("<tr />").append(i("<th/>"),i("<th/>").text(TYPO3.lang["file_upload.header.originalFile"]),i("<th/>").text(TYPO3.lang["file_upload.header.uploadedFile"]),i("<th/>").text(TYPO3.lang["file_upload.header.action"])))));for(let s=0;s<e;++s){const e=i("<tr />").append(i("<td />").append(""!==this.askForOverride[s].original.thumbUrl?i("<img />",{src:this.askForOverride[s].original.thumbUrl,height:40}):i(this.askForOverride[s].original.icon)),i("<td />").html(this.askForOverride[s].original.name+" ("+c.fileSizeAsString(this.askForOverride[s].original.size)+")<br>"+o.unix(this.askForOverride[s].original.mtime).format("YYYY-MM-DD HH:mm")),i("<td />").html(this.askForOverride[s].uploaded.name+" ("+c.fileSizeAsString(this.askForOverride[s].uploaded.size)+")<br>"+o(this.askForOverride[s].uploaded.lastModified?this.askForOverride[s].uploaded.lastModified:this.askForOverride[s].uploaded.lastModifiedDate).format("YYYY-MM-DD HH:mm")),i("<td />").append(i("<select />",{class:"form-control t3js-actions","data-override":s}).append(this.irreObjectUid?i("<option/>").val(p.USE_EXISTING).text(TYPO3.lang["file_upload.actions.use_existing"]):"",i("<option />",{selected:this.defaultAction===p.SKIP}).val(p.SKIP).text(TYPO3.lang["file_upload.actions.skip"]),i("<option />",{selected:this.defaultAction===p.RENAME}).val(p.RENAME).text(TYPO3.lang["file_upload.actions.rename"]),i("<option />",{selected:this.defaultAction===p.OVERRIDE}).val(p.OVERRIDE).text(TYPO3.lang["file_upload.actions.override"]))));t.find("table").append("<tbody />").append(e)}const a=l.confirm(TYPO3.lang["file_upload.existingfiles.title"],t,s.SeverityEnum.warning,[{text:i(this).data("button-close-text")||TYPO3.lang["file_upload.button.cancel"]||"Cancel",active:!0,btnClass:"btn-default",name:"cancel"},{text:i(this).data("button-ok-text")||TYPO3.lang["file_upload.button.continue"]||"Continue with selected actions",btnClass:"btn-warning",name:"continue"}],["modal-inner-scroll"]);a.find(".modal-dialog").addClass("modal-lg"),a.find(".modal-footer").prepend(i("<span/>").addClass("form-inline").append(i("<label/>").text(TYPO3.lang["file_upload.actions.all.label"]),i("<select/>",{class:"form-control t3js-actions-all"}).append(i("<option/>").val("").text(TYPO3.lang["file_upload.actions.all.empty"]),this.irreObjectUid?i("<option/>").val(p.USE_EXISTING).text(TYPO3.lang["file_upload.actions.all.use_existing"]):"",i("<option/>",{selected:this.defaultAction===p.SKIP}).val(p.SKIP).text(TYPO3.lang["file_upload.actions.all.skip"]),i("<option/>",{selected:this.defaultAction===p.RENAME}).val(p.RENAME).text(TYPO3.lang["file_upload.actions.all.rename"]),i("<option/>",{selected:this.defaultAction===p.OVERRIDE}).val(p.OVERRIDE).text(TYPO3.lang["file_upload.actions.all.override"]))));const r=this;a.on("change",".t3js-actions-all",(function(){const e=i(this).val();""!==e?a.find(".t3js-actions").each((t,s)=>{const a=i(s),o=parseInt(a.data("override"),10);a.val(e).prop("disabled","disabled"),r.askForOverride[o].action=a.val()}):a.find(".t3js-actions").removeProp("disabled")})).on("change",".t3js-actions",(function(){const e=i(this),t=parseInt(e.data("override"),10);r.askForOverride[t].action=e.val()})).on("button.clicked",(function(e){"cancel"===e.target.name?(r.askForOverride=[],l.dismiss()):"continue"===e.target.name&&(i.each(r.askForOverride,(e,t)=>{t.action===p.USE_EXISTING?c.addFileToIrre(r.irreObjectUid,t.original):t.action!==p.SKIP&&new g(r,t.uploaded,t.action)}),r.askForOverride=[],l.dismiss())})).on("hidden.bs.modal",()=>{this.askForOverride=[]})}}class g{constructor(e,t,s){if(this.dragUploader=e,this.file=t,this.override=s,this.$row=i("<tr />").addClass("upload-queue-item uploading"),this.$iconCol=i("<td />").addClass("col-icon").appendTo(this.$row),this.$fileName=i("<td />").text(t.name).appendTo(this.$row),this.$progress=i("<td />").attr("colspan",this.dragUploader.fileListColumnCount-2).appendTo(this.$row),this.$progressContainer=i("<div />").addClass("upload-queue-progress").appendTo(this.$progress),this.$progressBar=i("<div />").addClass("upload-queue-progress-bar").appendTo(this.$progressContainer),this.$progressPercentage=i("<span />").addClass("upload-queue-progress-percentage").appendTo(this.$progressContainer),this.$progressMessage=i("<span />").addClass("upload-queue-progress-message").appendTo(this.$progressContainer),0===i("tbody tr.upload-queue-item",this.dragUploader.$fileList).length?(this.$row.prependTo(i("tbody",this.dragUploader.$fileList)),this.$row.addClass("last")):this.$row.insertBefore(i("tbody tr.upload-queue-item:first",this.dragUploader.$fileList)),this.$iconCol.html('<span class="t3-icon t3-icon-mimetypes t3-icon-other-other">&nbsp;</span>'),this.dragUploader.maxFileSize>0&&this.file.size>this.dragUploader.maxFileSize)this.updateMessage(TYPO3.lang["file_upload.maxFileSizeExceeded"].replace(/\{0\}/g,this.file.name).replace(/\{1\}/g,c.fileSizeAsString(this.dragUploader.maxFileSize))),this.$row.addClass("error");else if(this.dragUploader.fileDenyPattern&&this.file.name.match(this.dragUploader.fileDenyPattern))this.updateMessage(TYPO3.lang["file_upload.fileNotAllowed"].replace(/\{0\}/g,this.file.name)),this.$row.addClass("error");else if(this.checkAllowedExtensions()){this.updateMessage("- "+c.fileSizeAsString(this.file.size));const e=new FormData;e.append("data[upload][1][target]",this.dragUploader.target),e.append("data[upload][1][data]","1"),e.append("overwriteExistingFiles",this.override),e.append("redirect",""),e.append("upload_1",this.file);const t=new XMLHttpRequest;t.onreadystatechange=()=>{t.readyState===XMLHttpRequest.DONE&&(200===t.status?this.uploadSuccess(JSON.parse(t.responseText)):this.uploadError(t))},t.upload.addEventListener("progress",e=>this.updateProgress(e)),t.open("POST",TYPO3.settings.ajaxUrls.file_process),t.send(e)}else this.updateMessage(TYPO3.lang["file_upload.fileExtensionExpected"].replace(/\{0\}/g,this.dragUploader.filesExtensionsAllowed)),this.$row.addClass("error")}updateMessage(e){this.$progressMessage.text(e)}removeProgress(){this.$progress&&this.$progress.remove()}uploadStart(){this.$progressPercentage.text("(0%)"),this.$progressBar.width("1%"),this.dragUploader.$trigger.trigger("uploadStart",[this])}uploadError(e){this.updateMessage(TYPO3.lang["file_upload.uploadFailed"].replace(/\{0\}/g,this.file.name));const t=i(e.responseText);t.is("t3err")?this.$progressPercentage.text(t.text()):this.$progressPercentage.text("("+e.statusText+")"),this.$row.addClass("error"),this.dragUploader.decrementQueueLength(),this.dragUploader.$trigger.trigger("uploadError",[this,e])}updateProgress(e){const t=Math.round(e.loaded/e.total*100)+"%";this.$progressBar.outerWidth(t),this.$progressPercentage.text(t),this.dragUploader.$trigger.trigger("updateProgress",[this,t,e])}uploadSuccess(e){e.upload&&(this.dragUploader.decrementQueueLength(),this.$row.removeClass("uploading"),this.$fileName.text(e.upload[0].name),this.$progressPercentage.text(""),this.$progressMessage.text("100%"),this.$progressBar.outerWidth("100%"),e.upload[0].icon&&this.$iconCol.html('<a href="#" class="t3js-contextmenutrigger" data-uid="'+e.upload[0].id+'" data-table="sys_file">'+e.upload[0].icon+"&nbsp;</span></a>"),this.dragUploader.irreObjectUid?(c.addFileToIrre(this.dragUploader.irreObjectUid,e.upload[0]),setTimeout(()=>{this.$row.remove(),0===i("tr",this.dragUploader.$fileList).length&&(this.dragUploader.$fileList.hide(),this.dragUploader.$trigger.trigger("uploadSuccess",[this,e]))},3e3)):setTimeout(()=>{this.showFileInfo(e.upload[0]),this.dragUploader.$trigger.trigger("uploadSuccess",[this,e])},3e3))}showFileInfo(e){this.removeProgress();for(let e=7;e<this.dragUploader.fileListColumnCount;e++)i("<td />").text("").appendTo(this.$row);i("<td />").text(e.extension.toUpperCase()).appendTo(this.$row),i("<td />").text(e.date).appendTo(this.$row),i("<td />").text(c.fileSizeAsString(e.size)).appendTo(this.$row);let t="";e.permissions.read&&(t+='<strong class="text-danger">'+TYPO3.lang["permissions.read"]+"</strong>"),e.permissions.write&&(t+='<strong class="text-danger">'+TYPO3.lang["permissions.write"]+"</strong>"),i("<td />").html(t).appendTo(this.$row),i("<td />").text("-").appendTo(this.$row)}checkAllowedExtensions(){if(!this.dragUploader.filesExtensionsAllowed)return!0;const e=this.file.name.split(".").pop(),t=this.dragUploader.filesExtensionsAllowed.split(",");return-1!==i.inArray(e.toLowerCase(),t)}}class c{static fileSizeAsString(e){const t=e/1024;let i="";return i=t>1024?(t/1024).toFixed(1)+" MB":t.toFixed(1)+" KB",i}static addFileToIrre(e,t){const i={actionName:"typo3:foreignRelation:inserted",objectGroup:e,table:"sys_file",uid:t.uid};a.MessageUtility.send(i)}static init(){const e=this.options;i.fn.extend({dragUploader:function(e){return this.each((t,s)=>{const a=i(s);let o=a.data("DragUploaderPlugin");o||a.data("DragUploaderPlugin",o=new h(s)),"string"==typeof e&&o[e]()})}}),i(()=>{i(".t3js-drag-uploader").dragUploader(e)})}}t.initialize=function(){c.init(),void 0!==TYPO3.settings&&void 0!==TYPO3.settings.RequireJS&&void 0!==TYPO3.settings.RequireJS.PostInitializationModules&&void 0!==TYPO3.settings.RequireJS.PostInitializationModules["TYPO3/CMS/Backend/DragUploader"]&&i.each(TYPO3.settings.RequireJS.PostInitializationModules["TYPO3/CMS/Backend/DragUploader"],(t,i)=>{e([i])})},t.initialize()}));