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
define(["require","exports"],function(t,e){"use strict";return new(function(){function t(){}return t.prototype.exportT3d=function(t,e){"pages"===t?top.TYPO3.Backend.ContentContainer.setUrl(top.TYPO3.settings.ImportExport.moduleUrl+"&tx_impexp[action]=export&id=0&tx_impexp[pagetree][id]="+e+"&tx_impexp[pagetree][levels]=0&tx_impexp[pagetree][tables][]=_ALL"):top.TYPO3.Backend.ContentContainer.setUrl(top.TYPO3.settings.ImportExport.moduleUrl+"&tx_impexp[action]=export&tx_impexp[record][]="+t+":"+e+"&tx_impexp[external_ref][tables][]=_ALL")},t.prototype.importT3d=function(t,e){top.TYPO3.Backend.ContentContainer.setUrl(top.TYPO3.settings.ImportExport.moduleUrl+"&id="+e+"&table="+t+"&tx_impexp[action]=import")},t}())});