/*
	The Legend of Zelda: Breath of the Wild Savegame Editor (Icons) v20190128

	by Marc Robledo 2017-2019


	icons extracted from https://www.spriters-resource.com/wii_u/thelegendofzeldabreathofthewild/
*/

const ICON_SIZE = 64;
const ICON_COLS = 16;
const IMG_PATH = './assets/';

const ICONS = {
	// ... (unchanged ICONS object)
};

const REPEAT_ARMOR_ICONS_1 = ['002', '003', '004', '015', '035', '039', '060', '061', '007', '062', '063', '064', '040', '065', '066', '067', '036', '071', '072', '073', '037', '074', '075', '076', '042', '077', '078', '079', '083', '084', '085', '086', '087', '088', '089', '090', '095', '096', '097', '098', '099', '100', '101', '102', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '103', '104', '105', '106', '111', '112', '113', '114', '152', '153', '154', '155', '148', '149', '150', '151', '156', '157', '158', '159', '201', '202', '203', '204', '206', '207', '208', '209', '211', '212', '213', '214', '216', '217', '218', '219', '221', '222', '223', '224', '226', '227', '228', '229', '231', '232', '233', '234', '186', '187', '188', '189', '190', '191', '192', '193', '194', '195', '196', '197', '198', '199', '168', '169'];
const REPEAT_ARMOR_ICONS_2 = ['001', '005', '006', '008', '009', '011', '012', '014', '017', '020', '021', '024', '025', '026', '027', '028', '029', '046', '048', '049', '116', '141', '200', '205', '210', '215', '220', '225', '230', '181', '182', '183', '184'];

const loadedImages = {};
let pendingImages = 23;
let isLoaded = false;

const canvas = document.createElement('canvas');
canvas.width = ICON_SIZE;
canvas.height = ICON_SIZE;
const ctx = canvas.getContext('2d');

const BOTW_Icons = (function () {
	const startLoadingIcons = () => {
		if (!isLoaded) {
			const iconKeys = Object.keys(ICONS);
			pendingImages = iconKeys.length; // Update pendingImages to the correct count
			iconKeys.forEach(fileName => {
				loadedImages[fileName] = new Image();
				loadedImages[fileName].addEventListener('load', () => {
					pendingImages--;
					if (pendingImages === 0) {
						isLoaded = true;
						BOTW_Icons.refreshAllIcons();
					}
				}, false);
				loadedImages[fileName].addEventListener('error', () => {
					console.error(`Failed to load image: ${IMG_PATH}${fileName}.png`);
					pendingImages--;
				}, false);
				loadedImages[fileName].src = `${IMG_PATH}${fileName}.png`;
			});
		}
	};

	const setIcon = (el, itemNameId, dyeColor) => {
		if (isLoaded) {
			el.src = _getItemIcon(itemNameId, dyeColor);
		} else {
			el.nextSrc = { id: itemNameId };
		}
	};

	const refreshAllIcons = () => {
		let iconId = 0;
		while (document.getElementById(`icon${iconId}`)) {
			const iconElement = document.getElementById(`icon${iconId}`);
			iconElement.src = _getItemIcon(iconElement.nextSrc.id);
			iconId++;
		}
	};

	const _getItemIcon = (itemNameId, clothesColor) => {
		let fileName, id, match;
		if (match = itemNameId.match(/^Armor_([0-9]{3})_(Head|Upper|Lower)(_Dye[0-9]{2})?/)) {
			fileName = `Armor_${match[2]}`;
			id = match[1];
			if (match[1] === 'Lower' && id === '140') {
				id = '141';
			}
			const index = REPEAT_ARMOR_ICONS_1.indexOf(id);
			if (index >= 0) {
				id = REPEAT_ARMOR_ICONS_2[Math.floor(index / 4)];
			}
		} else if (match = itemNameId.match(/^Item_(Chilled|ChilledFish|Enemy|Material|Meat|Roast|RoastFish)_([0-9]{2})/)) {
			fileName = `Item_${match[1]}`;
			id = match[2];
		} else if (itemNameId === 'Item_Enemy_Put_57') {
			fileName = 'Item_Enemy';
			id = 'Put_57';
		} else if (match = itemNameId.replace('Animal_Insect_', 'Item_InsectGet_').replace('Mushroom_', 'MushroomGet_').replace('Plant_', 'PlantGet_').match(/^Item_(FishGet|Fruit|InsectGet|MushroomGet|Ore|PlantGet)_([A-Z][A-B]?)/)) {
			fileName = `Item_${match[1]}`;
			id = match[2];
			if ((id === 'K' || id === 'O' || id === 'Z') && itemNameId.startsWith('Animal_Insect_')) {
				id = `Normal${id}`;
			}
		} else if (match = itemNameId.match(/^Item_Cook_([A-P]_[0-9]{2})/)) {
			fileName = 'Item_Cook';
			id = match[1];
		} else if (match = itemNameId.match(/^Weapon_(Sword|Lsword|Spear|Bow|Shield)_([0-9]{3})/)) {
			fileName = `Weapon_${match[1]}`;
			id = match[2];
		} else {
			fileName = 'Other';
			id = itemNameId;
		}

		const icon = fileName ? ICONS[fileName].indexOf(id) : -1;

		if (icon === -1) {
			return getBlankIcon();
		}

		if (itemNameId.startsWith('Armor_') && clothesColor && clothesColor <= 15) {
			icon += clothesColor;
		}

		if (isLoaded) {
			const img = loadedImages[fileName];
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, (icon % ICON_COLS) * ICON_SIZE, Math.floor(icon / ICON_COLS) * ICON_SIZE, ICON_SIZE, ICON_SIZE, 0, 0, ICON_SIZE, ICON_SIZE);
			return canvas.toDataURL();
		}
	};

	const getBlankIcon = () => `${IMG_PATH}_blank.png`;

	return {
		startLoadingIcons,
		setIcon,
		refreshAllIcons,
		_getItemIcon,
		getBlankIcon
	};
})();
