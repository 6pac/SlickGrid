# Change Log
All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [5.1.0](https://github.com/6pac/SlickGrid/compare/5.0.1...5.1.0) (2023-10-03)

### Bug Fixes

* active cell loses focus after editing or column reordering ([#851](https://github.com/6pac/SlickGrid/issues/851)) ([fc3bd25](https://github.com/6pac/SlickGrid/commit/fc3bd251872ab0cd1bc5aaa264f34283a5284659))
* add `autoEditNewRow` option to disable auto-edit new row, fix [#445](https://github.com/6pac/SlickGrid/issues/445) ([#855](https://github.com/6pac/SlickGrid/issues/855)) ([f0fa0bd](https://github.com/6pac/SlickGrid/commit/f0fa0bd25c04a6fe9c4f2ed82b8b504e63423592))

### Features

* add option to cancel Row Detail opening, closes [#378](https://github.com/6pac/SlickGrid/issues/378) ([#852](https://github.com/6pac/SlickGrid/issues/852)) ([1ad9f5c](https://github.com/6pac/SlickGrid/commit/1ad9f5ca388da363c81695ed711c32dc5cdc8afc))
* add pageUp/pageDown/home/end to SlickCellSelection, fixes [#794](https://github.com/6pac/SlickGrid/issues/794) ([#854](https://github.com/6pac/SlickGrid/issues/854)) ([f4956e4](https://github.com/6pac/SlickGrid/commit/f4956e426d34c01edc007356f8b6a50328c09a71))

## [5.0.1](https://github.com/6pac/SlickGrid/compare/5.0.0...5.0.1) (2023-09-27)

### Bug Fixes

* add missing font-size CSS var for grid top header ([9bb45a1](https://github.com/6pac/SlickGrid/commit/9bb45a144d3f185d180f8b1dc24c6e29c698fcd0))
* DataView setFilter had incorrect type, fixes [#848](https://github.com/6pac/SlickGrid/issues/848) ([#849](https://github.com/6pac/SlickGrid/issues/849)) ([3efb3f5](https://github.com/6pac/SlickGrid/commit/3efb3f5b1832e64f436536b5a2b8fec3424e1c88))
* remove devDependencies & scripts from npm publish ([0d9784a](https://github.com/6pac/SlickGrid/commit/0d9784a0ae82e1d6b34deb71d495803c0538a6a4))

# [5.0.0](https://github.com/6pac/SlickGrid/compare/4.0.1...5.0.0) (2023-09-19)

### Please read the [Migration Guide v5.0](https://github.com/6pac/SlickGrid/wiki/Major-version-5.0-%E2%80%90-ES6-ESM-and-TypeScript-Support)
---
### Breaking Change ⚠️
* prepare official 5.0 version release ([#845](https://github.com/6pac/SlickGrid/pull/845)) ([ad85e1](https://github.com/6pac/SlickGrid/commit/ad85e1234eef2548f5f4df34afebf18058ef9d33))

# [5.0.0-alpha.3](https://github.com/6pac/SlickGrid/compare/5.0.0-alpha.5...5.0.0-alpha.3) (2023-09-19)

### Bug Fixes

* invalid argument type for setSelectedIds() method ([330e0e3](https://github.com/6pac/SlickGrid/commit/330e0e3e6f233439532804cafccf65e5781a9dd3))

# [5.0.0-alpha.1](https://github.com/6pac/SlickGrid/compare/5.0.0-alpha.0...5.0.0-alpha.1) (2023-09-19)

### Bug Fixes

* CJS fallbacks should be at the end not at beginning ([a244ada](https://github.com/6pac/SlickGrid/commit/a244ada34bf47489c6c5064e405a6d2ae6046aca))
* copying multiple times only kept last undo CellExternalCopyManager ([cdda3fb](https://github.com/6pac/SlickGrid/commit/cdda3fb433c8350eecfe2e36f64ee26b083e3db6))

### Features

* add new trading platform high frequency update grid ([#835](https://github.com/6pac/SlickGrid/issues/835)) ([f86371b](https://github.com/6pac/SlickGrid/commit/f86371bdc15b76037f912717018e743c4202f232))
* migrate all Controls to TypeScript ([#808](https://github.com/6pac/SlickGrid/issues/808)) ([0d129bd](https://github.com/6pac/SlickGrid/commit/0d129bd4ffed69d913681e7f7ad7fd558b1ca7ec))
* migrate all Decorator & Selection Plugins to TypeScript ([#812](https://github.com/6pac/SlickGrid/issues/812)) ([cf3049e](https://github.com/6pac/SlickGrid/commit/cf3049ee05936b64bfe1abdc2aac932eb4a9751c))
* migrate all Menu/Buttons Plugins to TypeScript ([#811](https://github.com/6pac/SlickGrid/issues/811)) ([c66c429](https://github.com/6pac/SlickGrid/commit/c66c429246be74fa13e7b0c5917f6d81c36d0049))
* migrate CheckboxSelector & State Plugins to TypeScript ([#813](https://github.com/6pac/SlickGrid/issues/813)) ([2da9f7f](https://github.com/6pac/SlickGrid/commit/2da9f7f8fad1542bb15026bf0472d3462955b3ac))
* migrate CustomTooltip Plugin to TypeScript ([#816](https://github.com/6pac/SlickGrid/issues/816)) ([0f2b417](https://github.com/6pac/SlickGrid/commit/0f2b417fad5fb5ef3fd0456694d55fdee9af9ae9))
* migrate Draggable Grouping Plugins to TypeScript ([#814](https://github.com/6pac/SlickGrid/issues/814)) ([0037c7d](https://github.com/6pac/SlickGrid/commit/0037c7d831314706cc238340406e250f2d26ee64))
* migrate RemoteModel Plugins to TypeScript ([#823](https://github.com/6pac/SlickGrid/issues/823)) ([7a816e2](https://github.com/6pac/SlickGrid/commit/7a816e22333e817cc9f8d415beeedba9e01ad20f))
* migrate Resizer Plugin to TypeScript ([#815](https://github.com/6pac/SlickGrid/issues/815)) ([762ec3d](https://github.com/6pac/SlickGrid/commit/762ec3d3a3c08335ce2fec40d04bbaceb91ddeae))
* migrate RowDetail Plugin to TypeScript ([#822](https://github.com/6pac/SlickGrid/issues/822)) ([685b009](https://github.com/6pac/SlickGrid/commit/685b00922fae002b946b50efdae53dfafb277c54))
* migrate RowMoveManager Plugins to TypeScript ([#817](https://github.com/6pac/SlickGrid/issues/817)) ([8ad65ca](https://github.com/6pac/SlickGrid/commit/8ad65ca512e56a7c27d0b08ebcce656c4cf90c65))
* remove deprecated DataView methods ([#833](https://github.com/6pac/SlickGrid/issues/833)) ([0f3ba49](https://github.com/6pac/SlickGrid/commit/0f3ba49b103e7094089f917ad36d4da294618ea2))

## [4.0.1](https://github.com/6pac/SlickGrid/compare/4.0.0...4.0.1) (2023-06-30)

### Bug Fixes

* `getComputedStyle` could throw when DOM element is invalid ([#800](https://github.com/6pac/SlickGrid/issues/800)) ([2cecba1](https://github.com/6pac/SlickGrid/commit/2cecba1f25ca32a4c4e1384ed94c5234bb73140c))
* `onBeforeAppendCell` should only be used when it's a string ([#802](https://github.com/6pac/SlickGrid/issues/802)) ([b367209](https://github.com/6pac/SlickGrid/commit/b36720937d7276ed344979edb83b0e281a75d9df))
* allow for multiple css class names, fixes [#795](https://github.com/6pac/SlickGrid/issues/795) ([#797](https://github.com/6pac/SlickGrid/issues/797)) ([ab644b4](https://github.com/6pac/SlickGrid/commit/ab644b40516fb2f41f861f7010378c6f4d41adb9))
* **demo:** calling cancel or close button should close modal ([#790](https://github.com/6pac/SlickGrid/issues/790)) ([6edfdd7](https://github.com/6pac/SlickGrid/commit/6edfdd724b7982ea49767179998413b98f7254cd))
* **demo:** example with 3 plugins not sorting correctly ([#788](https://github.com/6pac/SlickGrid/issues/788)) ([e749aa9](https://github.com/6pac/SlickGrid/commit/e749aa968e9e2365d56ef81fa02e972b0777c722))
* Grid Menu is shown twice after changing frozen options ([#793](https://github.com/6pac/SlickGrid/issues/793)) ([b458c23](https://github.com/6pac/SlickGrid/commit/b458c235cfa1b3b7b2b2782469eeed5aa37099d8))
* make sure DOM element is valid before calling method on it ([#801](https://github.com/6pac/SlickGrid/issues/801)) ([b31a797](https://github.com/6pac/SlickGrid/commit/b31a797b8e1f25bd53a30b501ce20b2380e6d9f9))
* remove invalid TS type and invalid this object ([#786](https://github.com/6pac/SlickGrid/issues/786)) ([ca2393c](https://github.com/6pac/SlickGrid/commit/ca2393c553c3250a891a1d37e1145e74c326a114))
* replace some DOM Element functions not supported in Salesforce ([#796](https://github.com/6pac/SlickGrid/issues/796)) ([e427bd2](https://github.com/6pac/SlickGrid/commit/e427bd2e68edc14addfe04c1dc13ce1530334ea9))

### Features

* exclude checkbox selection from col picker/grid menu ([#787](https://github.com/6pac/SlickGrid/issues/787)) ([0b339e3](https://github.com/6pac/SlickGrid/commit/0b339e385d6341dd549a4c319b1963d702a127c7))

### Reverts

* Revert "feat: provide another styling theme (#779)" (#784) ([dafe1d1](https://github.com/6pac/SlickGrid/commit/dafe1d17debde0ea02635374f1eb6f2aa69c88e1)), closes [#779](https://github.com/6pac/SlickGrid/issues/779) [#784](https://github.com/6pac/SlickGrid/issues/784)

# [4.0.0](https://github.com/6pac/SlickGrid/compare/3.0.4...4.0.0) (2023-05-28)

### Please read the [Migration Guide v4.0](https://github.com/6pac/SlickGrid/wiki/Major-version-4.0---Removal-of-jQuery-requirement)

### Bug Fixes

* `idxById` could be undefined when changing page in SPA ([#782](https://github.com/6pac/SlickGrid/issues/782)) ([222725f](https://github.com/6pac/SlickGrid/commit/222725f0f68b993232bc2fabb725eada6208bf67))
* columnpicker and column order for hidden columns ([034108d](https://github.com/6pac/SlickGrid/commit/034108ddde688586e67b44f9d58e8d4d0d773767))
* dist source map file naming was incorrect ([#730](https://github.com/6pac/SlickGrid/issues/730)) ([aa4093a](https://github.com/6pac/SlickGrid/commit/aa4093a2b1d2afa791a645c65518fb2c35f50204))
* enable AutoScroll with SortableJS for column reordering, fixes [#735](https://github.com/6pac/SlickGrid/issues/735) ([c9ee9af](https://github.com/6pac/SlickGrid/commit/c9ee9af2df9ae8fdc8611fc0131a753a3e1e6cc3))
* enable AutoScroll with SortableJS for column reordering, fixes [#735](https://github.com/6pac/SlickGrid/issues/735) ([#736](https://github.com/6pac/SlickGrid/issues/736)) ([9fa0860](https://github.com/6pac/SlickGrid/commit/9fa0860253e48ccd2690d7e5e65cd8fc0afccec5))
* final fix for ColumnPicker and column hidden property ([000865d](https://github.com/6pac/SlickGrid/commit/000865d8823a66bd9f5289140bfb82d4d4b4254c))
* make sure column is defined before calling hidden prop ([#783](https://github.com/6pac/SlickGrid/issues/783)) ([29572a6](https://github.com/6pac/SlickGrid/commit/29572a68bc8f3246feeacd41036189c59e0ad9a6))
* rollback JS event passive mode in SlickGrid ([#778](https://github.com/6pac/SlickGrid/issues/778)) ([e61547e](https://github.com/6pac/SlickGrid/commit/e61547ea980ee42accac6cb4c2e76627c97599e4)), closes [#769](https://github.com/6pac/SlickGrid/issues/769)

### Features

* provide another styling theme ([#779](https://github.com/6pac/SlickGrid/issues/779)) ([bc96ddf](https://github.com/6pac/SlickGrid/commit/bc96ddf84df58bc530fcbc61f37b8db900523a27))

# [4.0.0-beta.0](https://github.com/6pac/SlickGrid/compare/3.0.4...4.0.0-beta.0) (2023-05-17)

### Please read the [Migration Guide v4.0](https://github.com/6pac/SlickGrid/wiki/Major-version-4.0---Removal-of-jQuery-requirement)
---
### Bug Fixes

* add missing aria accessibility ([#764](https://github.com/6pac/SlickGrid/issues/764)) ([897cc55](https://github.com/6pac/SlickGrid/commit/897cc55441625ab1bd3dd556c7c54d4796ce5f1d)), closes [#586](https://github.com/6pac/SlickGrid/issues/586) [#587](https://github.com/6pac/SlickGrid/issues/587) [#588](https://github.com/6pac/SlickGrid/issues/588) [#678](https://github.com/6pac/SlickGrid/issues/678)
* addresses all issues found in jQuery removal previous PR [#734](https://github.com/6pac/SlickGrid/issues/734) ([#742](https://github.com/6pac/SlickGrid/issues/742)) ([b3a6575](https://github.com/6pac/SlickGrid/commit/b3a6575bd913f5b8aa0c81dfe88b71519a7a846e))
* **core:** set wheel/touch listeners to passive for better perf ([#769](https://github.com/6pac/SlickGrid/issues/769)) ([b62e25d](https://github.com/6pac/SlickGrid/commit/b62e25d537c9a6cfb8b2004ad898b6bb0635dfd8))
* dist source map file naming was incorrect ([#730](https://github.com/6pac/SlickGrid/issues/730)) ([aa4093a](https://github.com/6pac/SlickGrid/commit/aa4093a2b1d2afa791a645c65518fb2c35f50204))
* enable AutoScroll with SortableJS for column reordering, fixes [#735](https://github.com/6pac/SlickGrid/issues/735) ([#736](https://github.com/6pac/SlickGrid/issues/736)) ([2c56433](https://github.com/6pac/SlickGrid/commit/2c5643313f7379877d4e4320bbe7b9de9585438c))
* filter header row should follow grid scroll ([98aeb9b](https://github.com/6pac/SlickGrid/commit/98aeb9b9b19ca2972af214629c62efc20330b5a0))
* scrolling for all containers should work for regular & frozen grids ([2405fe6](https://github.com/6pac/SlickGrid/commit/2405fe62b970eb84e5f24f7f5fbcb3f7b3469c78))
* throw error when freezing columns are wider than canvas ([#773](https://github.com/6pac/SlickGrid/issues/773)) ([bc60d8a](https://github.com/6pac/SlickGrid/commit/bc60d8ac4c9ab7fffbc38420e8a6c5b7234830dd)), closes [#667](https://github.com/6pac/SlickGrid/issues/667)
* toggling frozen rows should recalc scroll height, closes [#737](https://github.com/6pac/SlickGrid/issues/737) ([#774](https://github.com/6pac/SlickGrid/issues/774)) ([46db491](https://github.com/6pac/SlickGrid/commit/46db4914c19dd3c6789aaeed22cda91664a415fa))

### Features

* **controls:** remove jQuery from Slick Pager control ([#762](https://github.com/6pac/SlickGrid/issues/762)) ([ed0507b](https://github.com/6pac/SlickGrid/commit/ed0507bff30dc28f6e8b3f3ee7bf0f7339fd2282))
* Enable hidden property for column. Adds example-column-hidden, method… ([#765](https://github.com/6pac/SlickGrid/issues/765)) ([78540ef](https://github.com/6pac/SlickGrid/commit/78540ef2339dc3d47ca2faba78b7be3963e14ad0))
* **plugin:** convert slick.autotooltips to vanillaJS ([#745](https://github.com/6pac/SlickGrid/issues/745)) ([133d783](https://github.com/6pac/SlickGrid/commit/133d783d508e8c55d0b8196b90725079164e986d))
* **plugins:** convert copy manager plugins to vanillaJS ([#746](https://github.com/6pac/SlickGrid/issues/746)) ([47b571d](https://github.com/6pac/SlickGrid/commit/47b571d1fc376af01cb895d19f42205c8a34ddca))
* **plugins:** convert slick.draggablegrouping to vanillaJS ([#744](https://github.com/6pac/SlickGrid/issues/744)) ([59b0d2e](https://github.com/6pac/SlickGrid/commit/59b0d2e9f2ad549bb67982289b6c27862bab9ee1))
* **plugins:** remove jQuery from CellMenu & ContextMenu plugins ([#753](https://github.com/6pac/SlickGrid/issues/753)) ([c4671be](https://github.com/6pac/SlickGrid/commit/c4671be7385b8bac8fdfb82769f726bf8705bf84))
* **plugins:** remove jQuery from CheckboxSelectColumn plugins ([#755](https://github.com/6pac/SlickGrid/issues/755)) ([57160af](https://github.com/6pac/SlickGrid/commit/57160af7e5290730c0528f1cfebcaadae86820c3))
* **plugins:** remove jQuery from ColumnPicker & GridMenu controls ([#752](https://github.com/6pac/SlickGrid/issues/752)) ([9ea0d9a](https://github.com/6pac/SlickGrid/commit/9ea0d9a7fa5a1c453e737a60cd0f1292f822ac3b))
* **plugins:** remove jQuery from Grid Resizer plugin ([#758](https://github.com/6pac/SlickGrid/issues/758)) ([5deb818](https://github.com/6pac/SlickGrid/commit/5deb8188424f6cbc0876f4053c0dc5400212c70b))
* **plugins:** remove jQuery from Grid State plugin ([#757](https://github.com/6pac/SlickGrid/issues/757)) ([aa8dc63](https://github.com/6pac/SlickGrid/commit/aa8dc63b3e6e635c6a6419d79a5a2a29e2b29762))
* **plugins:** remove jQuery from header buttons/menus plugins ([#748](https://github.com/6pac/SlickGrid/issues/748)) ([58701c4](https://github.com/6pac/SlickGrid/commit/58701c4288744a1288b8cddbd9432b0d709ead30))
* **plugins:** remove jQuery from range decorator selection model ([#754](https://github.com/6pac/SlickGrid/issues/754)) ([6724f1d](https://github.com/6pac/SlickGrid/commit/6724f1db8d2a013d999e563ffab9a35897a72afb))
* **plugins:** remove jQuery from Row Detail plugin ([#760](https://github.com/6pac/SlickGrid/issues/760)) ([72e6139](https://github.com/6pac/SlickGrid/commit/72e61391147656151e22bc25abb583a0cba5cc89))
* **plugins:** remove jQuery from RowMove plugins ([#756](https://github.com/6pac/SlickGrid/issues/756)) ([8c72373](https://github.com/6pac/SlickGrid/commit/8c72373e6bcab2f1972de9a774ec89bc0ed8c187))
* **plugins:** remove jQuery from slick.customtooltip plugin ([#747](https://github.com/6pac/SlickGrid/issues/747)) ([aac6eec](https://github.com/6pac/SlickGrid/commit/aac6eecf99cfbbad7787cdbdfd95935955148fc2))
* remove legacy TreeColumns code - now unused ([#775](https://github.com/6pac/SlickGrid/issues/775)) ([af82a57](https://github.com/6pac/SlickGrid/commit/af82a570ba79e796400fc1e2ba265ffe2dafd480))

## [3.0.4](https://github.com/6pac/SlickGrid/compare/3.0.3...3.0.4) (2023-02-15)

### Features

* add `autoCommitEdit` grid option ([#725](https://github.com/6pac/SlickGrid/issues/725)) ([6225f46](https://github.com/6pac/SlickGrid/commit/6225f466314c6b1a343132d5e6cdceea16c9e6d6))

## [3.0.3](https://github.com/6pac/SlickGrid/compare/3.0.2...3.0.3) (2023-02-04)

### Bug Fixes

* cell selection in Firefox not working, fixes [#714](https://github.com/6pac/SlickGrid/issues/714) ([#715](https://github.com/6pac/SlickGrid/issues/715)) ([3583ffc](https://github.com/6pac/SlickGrid/commit/3583ffc8a6ed26c85132ab7cbcc7fb2ca5cbc024))
* horizontal scrolling can cause screen flickering ([#722](https://github.com/6pac/SlickGrid/issues/722)) ([0d4d943](https://github.com/6pac/SlickGrid/commit/0d4d943a2f952d7477c16bff98778a6223de6a37))

### Features

* **dataView:** add option to apply row selection to all pages ([#716](https://github.com/6pac/SlickGrid/issues/716)) ([6e4e83a](https://github.com/6pac/SlickGrid/commit/6e4e83a50e34beca776eb14e8c88dbf42dafa640)), closes [#689](https://github.com/6pac/SlickGrid/issues/689)

## [3.0.2](https://github.com/6pac/SlickGrid/compare/3.0.1...3.0.2) (2022-11-14)

## [3.0.1](https://github.com/6pac/SlickGrid/compare/2.4.45...3.0.1) (2022-11-14)

### Bug Fixes

* adjust the left/right canvas width properly when fullWidthRows is used ([#664](https://github.com/6pac/SlickGrid/issues/664)) ([d3de81c](https://github.com/6pac/SlickGrid/commit/d3de81cab64ca68ffa3cbb3e6ac7518414a97057))
* auto-scroll should work even without jQueryUI ([#703](https://github.com/6pac/SlickGrid/issues/703)) ([afca1a2](https://github.com/6pac/SlickGrid/commit/afca1a2a313aec063602d35bd17f849f22514374))
* auto-scroll should work even without jQueryUI ([#703](https://github.com/6pac/SlickGrid/issues/703)) ([4e5397d](https://github.com/6pac/SlickGrid/commit/4e5397d87e03288ff6c07fe34bad7f5326584ecd))
* **editors:** allow input editing with Flatpickr editor ([#704](https://github.com/6pac/SlickGrid/issues/704)) ([2d64e47](https://github.com/6pac/SlickGrid/commit/2d64e4788f575351b5408b6bf432fe0d049a4482))
* ensure H scrollbar is aways detected in resizeCanvas(). Fixes [#709](https://github.com/6pac/SlickGrid/issues/709) ([71bfd9a](https://github.com/6pac/SlickGrid/commit/71bfd9a57cac75280f6bab90532707721109fc6b))
* revert [#674](https://github.com/6pac/SlickGrid/issues/674) and disable v scrolling only where options.autoHeight is ([b156cfb](https://github.com/6pac/SlickGrid/commit/b156cfbdaba04c76cf3bfeeb9977b2a94922cb28)), closes [#711](https://github.com/6pac/SlickGrid/issues/711)

### Features

* **tooltip:** add new "center" and invert left/right align ([#712](https://github.com/6pac/SlickGrid/issues/712)) ([e26eeaf](https://github.com/6pac/SlickGrid/commit/e26eeaf2f51b8bbde7c16dda937273386dbf0ace))

# [3.0.0](https://github.com/6pac/SlickGrid/compare/2.4.45...3.0.0) (2022-10-09)

### Bug Fixes

* adjust the left/right canvas width properly when fullWidthRows is used ([#664](https://github.com/6pac/SlickGrid/issues/664)) ([d3de81c](https://github.com/6pac/SlickGrid/commit/d3de81cab64ca68ffa3cbb3e6ac7518414a97057))
* ensure npm exits (otherwise need to ctrl-c to get back to command prompt) ([6dd4649](https://github.com/6pac/SlickGrid/commit/6dd4649611c009b8546f0c382a7a18aca616b2db))
* gitCurrentBranchName should return the branch name not a process result object ([b25be57](https://github.com/6pac/SlickGrid/commit/b25be57ed6880ec30adec1541d829069db4c86ef))
* ignore untracked files in update script ([f213d8b](https://github.com/6pac/SlickGrid/commit/f213d8b533e171c35b94bd73bde018b2469144b8))
* replace inquirer with direct keyboard input ([7f12612](https://github.com/6pac/SlickGrid/commit/7f126121f67617aaca2e8931f12ec20a2c55ac1e))

### Features

* add npm scripts to create new version release & npm publish ([#701](https://github.com/6pac/SlickGrid/issues/701)) ([017bc7f](https://github.com/6pac/SlickGrid/commit/017bc7fde29745197c3a52d01f296f51ac58af94))
* BREAKING CHANGE - replace jQueryUI with SortableJS ([#695](https://github.com/6pac/SlickGrid/issues/695)) ([386cd58](https://github.com/6pac/SlickGrid/commit/386cd5813ce30c47891bbdf039ffddb89d9d24a3))

## [2.4.45](https://github.com/6pac/SlickGrid/compare/2.4.44...2.4.45) (2022-07-27)

## [2.4.44](https://github.com/6pac/SlickGrid/compare/2.4.43...2.4.44) (2021-12-06)

### Bug Fixes

* avoid showing empty text tooltip ([#658](https://github.com/6pac/SlickGrid/issues/658)) ([aafe999](https://github.com/6pac/SlickGrid/commit/aafe999d770eeaec30dcc138f9eb935e1ad970ca))

### Features

* add extra caller property to onSelectedRowsChanged ([#659](https://github.com/6pac/SlickGrid/issues/659)) ([e693a0c](https://github.com/6pac/SlickGrid/commit/e693a0c8b8290120eeabbcee41d5b249be248be0))
* add grid option to provide optional sanitizer function ([#657](https://github.com/6pac/SlickGrid/issues/657)) ([416992e](https://github.com/6pac/SlickGrid/commit/416992ed69f99faef55c495eb728dc0b87710993)), closes [#652](https://github.com/6pac/SlickGrid/issues/652)
* Auto scroll the viewport when dragging to make selection ([#656](https://github.com/6pac/SlickGrid/issues/656)) ([c06e3a3](https://github.com/6pac/SlickGrid/commit/c06e3a319e29ed6a72adccfa8d6a6dd8bae05429))

## [2.4.43](https://github.com/6pac/SlickGrid/compare/2.4.42...2.4.43) (2021-10-23)

### Features

* add basic html sanitizer w/regex to avoid xss scripting attack ([#652](https://github.com/6pac/SlickGrid/issues/652)) ([ffc682b](https://github.com/6pac/SlickGrid/commit/ffc682bbe39b62c17255f821c085db1e9cd0987e))
* add new Custom Tooltip plugin ([#650](https://github.com/6pac/SlickGrid/issues/650)) ([07cad59](https://github.com/6pac/SlickGrid/commit/07cad5934bb9940830f764359b5b64bd3fabf7ba))
* show a shadow element of the row being moved/dragged ([#651](https://github.com/6pac/SlickGrid/issues/651)) ([c6cfe18](https://github.com/6pac/SlickGrid/commit/c6cfe18bb9829a7840abe2ba45a074c06f89f03f))

## [2.4.42](https://github.com/6pac/SlickGrid/compare/2.4.41...2.4.42) (2021-09-28)

### Bug Fixes

* regression introduced by PR [#640](https://github.com/6pac/SlickGrid/issues/640) and commit f12f4cc ([#644](https://github.com/6pac/SlickGrid/issues/644)) ([aa21e33](https://github.com/6pac/SlickGrid/commit/aa21e3385f345c8d684533adad5d89c6a8c73ebc))

## [2.4.41](https://github.com/6pac/SlickGrid/compare/2.4.40...2.4.41) (2021-09-26)

## [2.4.40](https://github.com/6pac/SlickGrid/compare/2.4.39...2.4.40) (2021-09-09)

### Bug Fixes

* few minor fixes on plugin with menus ([#636](https://github.com/6pac/SlickGrid/issues/636)) ([4d93f52](https://github.com/6pac/SlickGrid/commit/4d93f52c66fab6c8d53e97d862ab29d367114f60))
* grid with Grouping, Row Select All shouldn't include grouping rows ([#635](https://github.com/6pac/SlickGrid/issues/635)) ([d634221](https://github.com/6pac/SlickGrid/commit/d63422159e5f484e003275a9a29de4f2233c9cda))

### Features

* make `onBeforePagingInfoChanged` cancellable ([#634](https://github.com/6pac/SlickGrid/issues/634)) ([5fa4d8c](https://github.com/6pac/SlickGrid/commit/5fa4d8c3dfc8150f8e9525f5a5b2c1905b250bb5)), closes [#625](https://github.com/6pac/SlickGrid/issues/625)

## [2.4.39](https://github.com/6pac/SlickGrid/compare/2.4.38...2.4.39) (2021-09-03)

### Bug Fixes

* use Header Menu width (instead of minWidth) to align right ([#624](https://github.com/6pac/SlickGrid/issues/624)) ([beef51f](https://github.com/6pac/SlickGrid/commit/beef51f6b9bf0111116e87b4bd5e57111444ee19))
* use tooltip from header menu options is the correct location ([#626](https://github.com/6pac/SlickGrid/issues/626)) ([44fe869](https://github.com/6pac/SlickGrid/commit/44fe86924970d1b5ad3ab3380ca17926604c7db0))

### Features

* add `command` (execute/undo) to `onCellChange` event ([#622](https://github.com/6pac/SlickGrid/issues/622)) ([dc9f2e1](https://github.com/6pac/SlickGrid/commit/dc9f2e1e18fa05f843f9d3fdeef452784e838186))
* add `onBeforeSort` to optionally cancel `onSort` ([3a1202a](https://github.com/6pac/SlickGrid/commit/3a1202a42b1580a54a66b87ded6dd76090f3ea44))
* add `previousSortColumns` to `onSort` and `onBeforeSort` ([#633](https://github.com/6pac/SlickGrid/issues/633)) ([115367f](https://github.com/6pac/SlickGrid/commit/115367fc2b836efee3b7c85930b7348cdaa46026))
* add new event `onBeforeSetColumns` ([#625](https://github.com/6pac/SlickGrid/issues/625)) ([9c3ce51](https://github.com/6pac/SlickGrid/commit/9c3ce51eb22423cba252bc75de1d6b930c55f2a2))

## [2.4.38](https://github.com/6pac/SlickGrid/compare/2.4.37...2.4.38) (2021-06-25)

### Bug Fixes

* Grid Menu grid options should be passed by reference ([#619](https://github.com/6pac/SlickGrid/issues/619)) ([7c21d0f](https://github.com/6pac/SlickGrid/commit/7c21d0f5cea93d8b13576e9befa8d53df6c20bab)), closes [#615](https://github.com/6pac/SlickGrid/issues/615)

## [2.4.37](https://github.com/6pac/SlickGrid/compare/2.4.36...2.4.37) (2021-06-25)

### Bug Fixes

* broken UI when loading grid from hidden div/tab ([#618](https://github.com/6pac/SlickGrid/issues/618)) ([2ba2007](https://github.com/6pac/SlickGrid/commit/2ba2007ee7a4c1e0878badd9066c0b84ead5683e))
* **plugin:** only check override if we can move row in first place ([#613](https://github.com/6pac/SlickGrid/issues/613)) ([2ffccc6](https://github.com/6pac/SlickGrid/commit/2ffccc62ea50cc19c697e404e8ac553606b7b9b5))

### Features

* add filtered item count ([#616](https://github.com/6pac/SlickGrid/issues/616)) ([e72eae9](https://github.com/6pac/SlickGrid/commit/e72eae9574405e8b998bdccdab651951d85e7145))

## [2.4.36](https://github.com/6pac/SlickGrid/compare/2.4.35...2.4.36) (2021-05-18)

### Bug Fixes

* `setOptions` should call `setOverflow` when changing frozenColumns ([#608](https://github.com/6pac/SlickGrid/issues/608)) ([4af8c72](https://github.com/6pac/SlickGrid/commit/4af8c721942fe0b827fadcaf250bb0d515c8c310))
* left frozen section shoudn't go over viewport width, fix [#473](https://github.com/6pac/SlickGrid/issues/473) ([#607](https://github.com/6pac/SlickGrid/issues/607)) ([f229917](https://github.com/6pac/SlickGrid/commit/f2299175c2e1e8d1ca5c63871dcc84e7ebf2ec1c))

## [2.4.35](https://github.com/6pac/SlickGrid/compare/2.4.34...2.4.35) (2021-05-09)

### Bug Fixes

* deactivate edit controller shouldn't throw when active is null ([#604](https://github.com/6pac/SlickGrid/issues/604)) ([28f44a3](https://github.com/6pac/SlickGrid/commit/28f44a389d950fa5a7cec42947e518e556071766))
* get viewport node by specified row and column like canvas ([#601](https://github.com/6pac/SlickGrid/issues/601)) ([4edcca2](https://github.com/6pac/SlickGrid/commit/4edcca2681e9e602a19a6d927819caa1646ecc14))

### Features

* add onColumnsResizeDblClick event to adding new resize extras ([#605](https://github.com/6pac/SlickGrid/issues/605)) ([d270367](https://github.com/6pac/SlickGrid/commit/d270367dbdf1074747fdb3caa47ea29ae1ca094d))

## [2.4.34](https://github.com/6pac/SlickGrid/compare/2.4.33...2.4.34) (2021-04-09)

### Bug Fixes

* add preventDefault to optionally leave plugin menu open ([#589](https://github.com/6pac/SlickGrid/issues/589)) ([c7dfe45](https://github.com/6pac/SlickGrid/commit/c7dfe451dc0fd9415eeef30b517e2251a977c449)), closes [#582](https://github.com/6pac/SlickGrid/issues/582)

### Features

* add better error message when throwing ([#599](https://github.com/6pac/SlickGrid/issues/599)) ([4bac2f8](https://github.com/6pac/SlickGrid/commit/4bac2f89acfa0603283316d42d19403972b76a5d))
* add target to `onBeforeEditCell` ([#594](https://github.com/6pac/SlickGrid/issues/594)) ([e06f1a2](https://github.com/6pac/SlickGrid/commit/e06f1a2350a5fe1ce023bde7c15551ceac67f424))
* expose `reRenderColumns` as public method ([#583](https://github.com/6pac/SlickGrid/issues/583)) ([3f6e7d7](https://github.com/6pac/SlickGrid/commit/3f6e7d785bcad99d30017b593a873766011e00d1))

## [2.4.33](https://github.com/6pac/SlickGrid/compare/2.4.32...2.4.33) (2021-02-02)

### Features

* add getItemsCount function to DataView & update few npm packages ([#569](https://github.com/6pac/SlickGrid/issues/569)) ([19bf981](https://github.com/6pac/SlickGrid/commit/19bf98185211d2f226347c0e29e398b5432e3c98))
* add item count to data change handlers ([#570](https://github.com/6pac/SlickGrid/issues/570)) ([32e03d5](https://github.com/6pac/SlickGrid/commit/32e03d5a04b576e9e985b6a3321b82eb97ace3a9))

## [2.4.32](https://github.com/6pac/SlickGrid/compare/2.4.31...2.4.32) (2020-12-02)

### Bug Fixes

* add grid object to all Formatter calls ([#558](https://github.com/6pac/SlickGrid/issues/558)) ([8d957f1](https://github.com/6pac/SlickGrid/commit/8d957f159c5cb0ece7157f0f44b29a9630c64eb4))
* **editors:** make sure editor exist before trying to focus on it ([#554](https://github.com/6pac/SlickGrid/issues/554)) ([69a6b86](https://github.com/6pac/SlickGrid/commit/69a6b86badd31d2263a58fadd4145074d26a9194))
* remove mousewheel scroll handler when option is disable ([#557](https://github.com/6pac/SlickGrid/issues/557)) ([702c793](https://github.com/6pac/SlickGrid/commit/702c7930168425270968d5288075e88235ef085f))
* we should remove all event listeners when calling destroy ([#556](https://github.com/6pac/SlickGrid/issues/556)) ([708b070](https://github.com/6pac/SlickGrid/commit/708b07067f4505d734bb889fe2253809d82c02a1))

### Features

* add columnId to onColumnsChanged event ([#561](https://github.com/6pac/SlickGrid/issues/561)) ([319046e](https://github.com/6pac/SlickGrid/commit/319046e73e2d3e110ff7ac39279494c007214518))
* add enableMouseWheelScrollHandler option to allow dynamic load ([#555](https://github.com/6pac/SlickGrid/issues/555)) ([5077d31](https://github.com/6pac/SlickGrid/commit/5077d31a12636396e99c063f1a758d0e5919a57c))

## [2.4.31](https://github.com/6pac/SlickGrid/compare/2.4.30...2.4.31) (2020-11-14)

### Bug Fixes

* unsubscribe everything event & nullify DOM elements avoid detach elements ([#551](https://github.com/6pac/SlickGrid/issues/551)) ([e3f4961](https://github.com/6pac/SlickGrid/commit/e3f4961c8c8270ac6241a3644b9fad44d14ddc1f))

### Features

* **dataView:** add getAllSelectedItems function ([#544](https://github.com/6pac/SlickGrid/issues/544)) ([39707b8](https://github.com/6pac/SlickGrid/commit/39707b830b270ced2a26436a50092d5d81ebb615))

## [2.4.30](https://github.com/6pac/SlickGrid/compare/2.4.29...2.4.30) (2020-10-14)

### Bug Fixes

* **core:** we should never show vertical scroll on left frozen container ([#537](https://github.com/6pac/SlickGrid/issues/537)) ([aa42f8b](https://github.com/6pac/SlickGrid/commit/aa42f8bed290b00bc691cf14f8e5a17d3e43dabe))
* **resizer:** add flag to apply resize to grid container, default false ([#538](https://github.com/6pac/SlickGrid/issues/538)) ([beeb622](https://github.com/6pac/SlickGrid/commit/beeb622da3d0cbbe960b68e2f1aad4a28adeab96))

### Features

* **core:** add column object to onCellChange event ([#539](https://github.com/6pac/SlickGrid/issues/539)) ([0d9ee69](https://github.com/6pac/SlickGrid/commit/0d9ee691d9c95362c50b7c270ca459750f8c4bd0))
* **editors:** add all Editors instance refs to Composite Editor options ([#540](https://github.com/6pac/SlickGrid/issues/540)) ([2160f31](https://github.com/6pac/SlickGrid/commit/2160f315044ce9e31341715c20d8474b3a4ff9fe))

## [2.4.29](https://github.com/6pac/SlickGrid/compare/2.4.28...2.4.29) (2020-09-25)

### Bug Fixes

* **plugins:** Row Move icon formatter should have text property ([#535](https://github.com/6pac/SlickGrid/issues/535)) ([181c9d9](https://github.com/6pac/SlickGrid/commit/181c9d9dba3d774d8f9db3d6902af5fe9073c107))

### Features

* **core:** add a supressColumnSet on setOptions method ([#534](https://github.com/6pac/SlickGrid/issues/534)) ([e333c9d](https://github.com/6pac/SlickGrid/commit/e333c9df6ef4721d657411d77ec990a86eeb67a2))
* **plugins:** add "hidden" property to all plugins with menu items ([#532](https://github.com/6pac/SlickGrid/issues/532)) ([efc5608](https://github.com/6pac/SlickGrid/commit/efc56088290dbe61fa589d17d254b05fdff9eefd))

## [2.4.28](https://github.com/6pac/SlickGrid/compare/2.4.27...2.4.28) (2020-09-05)

### Features

* **editor:** add more functionalities to Composite Editor ([#530](https://github.com/6pac/SlickGrid/issues/530)) ([4a0996a](https://github.com/6pac/SlickGrid/commit/4a0996a89867b45638a91749cf0aa3578d810653))

## [2.4.27](https://github.com/6pac/SlickGrid/compare/2.4.26...2.4.27) (2020-07-26)

### Features

* **resizer:** add optional grid container to resize ([#523](https://github.com/6pac/SlickGrid/issues/523)) ([f0d73cf](https://github.com/6pac/SlickGrid/commit/f0d73cf7814ee2fac92835d9b0762500388f29a8))

## [2.4.26](https://github.com/6pac/SlickGrid/compare/2.4.25...2.4.26) (2020-07-25)

## [2.4.25](https://github.com/6pac/SlickGrid/compare/2.4.24...2.4.25) (2020-06-29)

### Bug Fixes

* **gridMenu:** Grid Menu wrong location changing from regular to frozen ([#513](https://github.com/6pac/SlickGrid/issues/513)) ([77f0d38](https://github.com/6pac/SlickGrid/commit/77f0d384cfcb7a5111fd909eb7aeb86a7aa6fe18))
* **grouping:** collapse all then expand sub-group, fixes [#512](https://github.com/6pac/SlickGrid/issues/512) ([#516](https://github.com/6pac/SlickGrid/issues/516)) ([fc2dfd7](https://github.com/6pac/SlickGrid/commit/fc2dfd7808e2860d5be873293628f04681f6960d))
* **plugin:** check options exist before getting prop ([#510](https://github.com/6pac/SlickGrid/issues/510)) ([4a1c0e5](https://github.com/6pac/SlickGrid/commit/4a1c0e5a826249a22a32f274a484d0db06598732))

## [2.4.24](https://github.com/6pac/SlickGrid/compare/2.4.23...2.4.24) (2020-05-23)

### Bug Fixes

* **core:** rollback PR [#497](https://github.com/6pac/SlickGrid/issues/497) which is now causing resize issue ([#503](https://github.com/6pac/SlickGrid/issues/503)) ([af948b1](https://github.com/6pac/SlickGrid/commit/af948b19d22427d24075f5ebfd7e7743908b4d3d))
* **gridMenu:** add "height" and "marginBottom" options ([#506](https://github.com/6pac/SlickGrid/issues/506)) ([8100ca1](https://github.com/6pac/SlickGrid/commit/8100ca10f54c085e6bb779a4deecb996c9970a9c))
* **resizer:** check for undefined option instead of fallback, fix [#504](https://github.com/6pac/SlickGrid/issues/504) ([#507](https://github.com/6pac/SlickGrid/issues/507)) ([4d70df7](https://github.com/6pac/SlickGrid/commit/4d70df7ac3a5a76759f019e796fd7b99d84e95f6))

## [2.4.23](https://github.com/6pac/SlickGrid/compare/2.4.22...2.4.23) (2020-05-19)

### Bug Fixes

* **core:** `resizeCanvas` should include preheader height, fixes [#493](https://github.com/6pac/SlickGrid/issues/493) ([#497](https://github.com/6pac/SlickGrid/issues/497)) ([af6151f](https://github.com/6pac/SlickGrid/commit/af6151fbb7098bc22adfa37a7ad28a1a7ce7c637))
* **gridMenu:** add missing "headerColumnValueExtractor" to Grid Menu & fix [#490](https://github.com/6pac/SlickGrid/issues/490) ([#491](https://github.com/6pac/SlickGrid/issues/491)) ([eec27b7](https://github.com/6pac/SlickGrid/commit/eec27b7be4c2e1aaa93e38293b39c9e82dc201d5))
* **npm:** remove certain files from npm, closes [#499](https://github.com/6pac/SlickGrid/issues/499) ([#501](https://github.com/6pac/SlickGrid/issues/501)) ([886641f](https://github.com/6pac/SlickGrid/commit/886641f58abeb50781e9cd3467c722667c1d7144))
* **picker:** ColumnPicker/GridMenu exclude hiden cols when forceFitCols ([#494](https://github.com/6pac/SlickGrid/issues/494)) ([a29eff1](https://github.com/6pac/SlickGrid/commit/a29eff1151e03d1153a15934da94a8ad27fefe14))
* **pickers:** ColumnPicker/GridMenu with 2 independent grids ([#500](https://github.com/6pac/SlickGrid/issues/500)) ([a7af294](https://github.com/6pac/SlickGrid/commit/a7af2940bbae589bf4a30db04be036717d3391eb))
* **plugin:** make sure from/to exist before getting values, ref [#488](https://github.com/6pac/SlickGrid/issues/488) ([#496](https://github.com/6pac/SlickGrid/issues/496)) ([62d2c14](https://github.com/6pac/SlickGrid/commit/62d2c148be0c914b68f0fa805d46ec2671804535))

## [2.4.22](https://github.com/6pac/SlickGrid/compare/2.4.21...2.4.22) (2020-05-06)

### Bug Fixes

* **plugin:** check usabilityOverride before accepting new position ([#485](https://github.com/6pac/SlickGrid/issues/485)) ([dc554f5](https://github.com/6pac/SlickGrid/commit/dc554f5eb585517f70ada637b38e90d287ed3aa1))
* **plugin:** Row Move Formatter should have empty text value ([#484](https://github.com/6pac/SlickGrid/issues/484)) ([e64c6c8](https://github.com/6pac/SlickGrid/commit/e64c6c8712f25103fc5f9ba4c2000cc3b2658e7b))
* **rowDetail:** use column id instead of item id ([#489](https://github.com/6pac/SlickGrid/issues/489)) ([fc3c3d1](https://github.com/6pac/SlickGrid/commit/fc3c3d189f0d04e926110a23a94e0e1375df782c))

### Features

* **animation:** add option to disable animation on all setVisibility fn ([#481](https://github.com/6pac/SlickGrid/issues/481)) ([a35c643](https://github.com/6pac/SlickGrid/commit/a35c643d20a5705ffecf68f0ecb8f886a049ba2a))

## [2.4.21](https://github.com/6pac/SlickGrid/compare/2.4.20...2.4.21) (2020-03-27)

### Bug Fixes

* **example:** fix the view source example link of new demo ([6ebe30d](https://github.com/6pac/SlickGrid/commit/6ebe30d077c047a2877bc93a0668ba863c1b2c47))

## [2.4.20](https://github.com/6pac/SlickGrid/compare/2.4.19...2.4.20) (2020-03-27)

### Bug Fixes

* **npm:** update Cypress to fix security warnings, fixes [#471](https://github.com/6pac/SlickGrid/issues/471) ([#472](https://github.com/6pac/SlickGrid/issues/472)) ([3a7ef63](https://github.com/6pac/SlickGrid/commit/3a7ef63cefeaa5f4b159f578aa4baa6c2a4075f6))
* **plugin:** remove unnecessary tooltip when checbox hidden ([#477](https://github.com/6pac/SlickGrid/issues/477)) ([e062f86](https://github.com/6pac/SlickGrid/commit/e062f863bec1dd2ffb8539aa1601740349ab22d4))
* **resize:** measure scrollbar from body instead of viewport, fixes  275 ([d705e15](https://github.com/6pac/SlickGrid/commit/d705e1528c002098695f23750cfd68c27549c81b))

### Features

* **plugins:** add ways to use all 3 plugins together, closes [#347](https://github.com/6pac/SlickGrid/issues/347) ([#474](https://github.com/6pac/SlickGrid/issues/474)) ([90ead54](https://github.com/6pac/SlickGrid/commit/90ead545e9a84292b07d510acc56718bf757edd3))

## [2.4.19](https://github.com/6pac/SlickGrid/compare/2.4.18...2.4.19) (2020-03-06)

### Bug Fixes

* **cellMenu:** stop event bubbling only on valid cell menu column ([e49a569](https://github.com/6pac/SlickGrid/commit/e49a569b4dc48b624eed386cba3f58691fac485d))

### Features

* **plugin:** create a new Resizer plugin for easier auto-resize ([4745158](https://github.com/6pac/SlickGrid/commit/4745158c45b545a5fe1e90c21ffa354c40554b0f))

### Reverts

* Revert "`title` only added if no `title` is already defined" ([89e71ec](https://github.com/6pac/SlickGrid/commit/89e71ec21282808a6be2c55f125f437589459c6b))
* Revert "`title` only added if no `title` is already defined" ([3088d74](https://github.com/6pac/SlickGrid/commit/3088d74c86bc38ac0fc51413ec40e747bd5989eb))
* Revert "Update README.md" ([fdbcf20](https://github.com/6pac/SlickGrid/commit/fdbcf2039aeabfb841e76c97132172168845dce3))

## [2.4.18](https://github.com/6pac/SlickGrid/compare/2.4.17...2.4.18) (2020-01-29)

### Features

* **menus:** add "onAfterMenuShow" event to all possible menu plugins ([c2474e5](https://github.com/6pac/SlickGrid/commit/c2474e5bdabb2782e8390724d5f46ed3cc491ed1))
* **paging:** add "onBeforePagingInfoChanged" to DataView and fix [#457](https://github.com/6pac/SlickGrid/issues/457) ([a59699a](https://github.com/6pac/SlickGrid/commit/a59699a06b0fee29524108718d04e062365c00e4))
* **selection:** add previousSelectedRows into "onSelectedRowsChanged" ([ce249a2](https://github.com/6pac/SlickGrid/commit/ce249a2ced30feb5821c3b3fc4287c32ffb8fa53))

## [2.4.17](https://github.com/6pac/SlickGrid/compare/2.4.16...2.4.17) (2020-01-10)

### Bug Fixes

* **drag:** make sure drag event are only for slickgrid, fixes [#239](https://github.com/6pac/SlickGrid/issues/239) ([e74d763](https://github.com/6pac/SlickGrid/commit/e74d76332f396ababd8e98ecbd25b6a12a6c657f))
* **example:** cell menu has typo in css stylesheet filename ([7ef5973](https://github.com/6pac/SlickGrid/commit/7ef597320d718c30c34dd5b3a7bb6d459c3eb077))
* **picker:** incorrect output for visibleColumns & fadeSpeed option ([#453](https://github.com/6pac/SlickGrid/issues/453)) ([0b5c0a2](https://github.com/6pac/SlickGrid/commit/0b5c0a260f5f2c5a69048be642737c6d7a49fb4c))

## [2.4.16](https://github.com/6pac/SlickGrid/compare/2.4.15...2.4.16) (2019-12-18)

### Features

* **menu:** add more functionalities to Header & Grid Menus ([#452](https://github.com/6pac/SlickGrid/issues/452)) ([3fe41fb](https://github.com/6pac/SlickGrid/commit/3fe41fbbb743907f878b2d1fae000fd9a41706a7))
* **menu:** add new plugins - ContextMenu & CellContextMenu ([#449](https://github.com/6pac/SlickGrid/issues/449)) ([db999dc](https://github.com/6pac/SlickGrid/commit/db999dcdc83112195bbb01d29b1988584a278d1f))

## [2.4.15](https://github.com/6pac/SlickGrid/compare/2.4.14...2.4.15) (2019-12-08)

### Bug Fixes

* **gridMenu:** menu at wrong place when using Frozen Col 0, fixes [#436](https://github.com/6pac/SlickGrid/issues/436) ([7bd6f27](https://github.com/6pac/SlickGrid/commit/7bd6f27b6a5692c7d97a1fffcb6fd06bb93e02ee))
* **gridMenu:** Menu should work with Frozen Col 0, fixes [#436](https://github.com/6pac/SlickGrid/issues/436) ([5b9607f](https://github.com/6pac/SlickGrid/commit/5b9607ffb1f9b34bb54cc7afffa1f73c150a8bbd))
* **rowDetail:** work with DataView custom "id" property name, fixes [#420](https://github.com/6pac/SlickGrid/issues/420) ([9c4fbad](https://github.com/6pac/SlickGrid/commit/9c4fbadaaf8503eed033485c33727a35ac5168c6))

## [2.4.14](https://github.com/6pac/SlickGrid/compare/2.4.13...2.4.14) (2019-09-16)

## [2.4.13](https://github.com/6pac/SlickGrid/compare/2.4.12...2.4.13) (2019-08-30)

### Features

* **cypress:** add Cypress E2E Grid Menu full test suite ([bd39e58](https://github.com/6pac/SlickGrid/commit/bd39e585f52d403750326aee449665691edf0c78))
* **cypress:** update to latest version of Cypress ([102aca7](https://github.com/6pac/SlickGrid/commit/102aca7303437b5a5f36090bf0743e751d728c14))
* **gridState:** add a new Grid State plugin with example ([bcb9c92](https://github.com/6pac/SlickGrid/commit/bcb9c92cefca07634204324686489f1fefd06ad9))

## [2.4.12](https://github.com/6pac/SlickGrid/compare/2.4.11...2.4.12) (2019-08-28)

## [2.4.11](https://github.com/6pac/SlickGrid/compare/2.4.10...2.4.11) (2019-07-31)

### Bug Fixes

* **build:** fixes a parsing issue found while builing Aurelia-Slickgrid ([645325d](https://github.com/6pac/SlickGrid/commit/645325d6314b9dfc2589b8f272891708425b7eb9))
* **example:** remove unused deleted grid option ([4572d07](https://github.com/6pac/SlickGrid/commit/4572d07dc038ececfcfc3c06d5005e04a5341d50))
* **header:** remove all showColumnLabels and replace by showColumnHeader ([7112fd4](https://github.com/6pac/SlickGrid/commit/7112fd4308c51c88e12e6e702d3aab5067056e1a))
* **license:** use a more standard naming format, closes [#390](https://github.com/6pac/SlickGrid/issues/390) ([fe3e38b](https://github.com/6pac/SlickGrid/commit/fe3e38bd1fe5c01dfee3453637046a00401a86c2))
* **picker:** column exclude from ColumnPicker, GridMenu caussing issue ([#402](https://github.com/6pac/SlickGrid/issues/402)) ([56f6724](https://github.com/6pac/SlickGrid/commit/56f6724a10378608485ceba721d0629250f2b48a)), closes [#399](https://github.com/6pac/SlickGrid/issues/399)
* **scrollbar:** horizontal was hidden because of showColumnLabels ([ceded1b](https://github.com/6pac/SlickGrid/commit/ceded1b737764394e8c58965fe88400c550c722b))

### Features

* **controls:** add updateAllTitles to controls ([a96c408](https://github.com/6pac/SlickGrid/commit/a96c4089c9b15dbb345019a917b93e681d7ff690))
* **e2e:** add Cypress to the project for E2E testing ([996dc7b](https://github.com/6pac/SlickGrid/commit/996dc7b7992db88d20839af7c85ee088d14a4f9d))

## [2.4.10](https://github.com/6pac/SlickGrid/compare/2.4.9...2.4.10) (2019-07-12)

## [2.4.9](https://github.com/6pac/SlickGrid/compare/2.4.8...2.4.9) (2019-06-09)

### Bug Fixes

* **event:** rollback commit 34ec867 to fix column resize is broken ([832d2ed](https://github.com/6pac/SlickGrid/commit/832d2edef06c1c170eb641169744ae6487585c13))
* **ie:** increase performance in IE, closes [#367](https://github.com/6pac/SlickGrid/issues/367) ([7408a11](https://github.com/6pac/SlickGrid/commit/7408a11d6c87b5c3375edf5564c76ef77f041416))

## [2.4.8](https://github.com/6pac/SlickGrid/compare/2.4.7...2.4.8) (2019-05-24)

### Bug Fixes

* **plugin:** Row Detail always show a scroll even when has enough space ([#370](https://github.com/6pac/SlickGrid/issues/370)) ([a0300f0](https://github.com/6pac/SlickGrid/commit/a0300f01ac2047a9b6829fa7db59a229946f000c))

### Features

* **columnPicker:** add columnDef option to exclude a column from picker ([2c38c59](https://github.com/6pac/SlickGrid/commit/2c38c59836d7624bf8cce47162de6463d73b5ae6))
* **gridMenu:** add columnDef option to exclude a column from grid menu ([d8df5d0](https://github.com/6pac/SlickGrid/commit/d8df5d0b564fadcf68c4bb6bb006900bb1ec9b9f))
* **gridMenu:** rename column field to # instead of Id ([b6f0b61](https://github.com/6pac/SlickGrid/commit/b6f0b61e0726302769839d7319f7e113905f347c))
* **rowDetail:** add option "singleRowExpand" ([bfe6512](https://github.com/6pac/SlickGrid/commit/bfe6512b3dc6c5ea2585661bd134dff56ec335b0)), closes [#194](https://github.com/6pac/SlickGrid/issues/194)

## [2.4.7](https://github.com/6pac/SlickGrid/compare/2.4.6...2.4.7) (2019-04-17)

## [2.4.6](https://github.com/6pac/SlickGrid/compare/2.4.5...2.4.6) (2019-04-07)

### Bug Fixes

* **autoHeight:** horizontal scroll not showing when needed, fixes [#356](https://github.com/6pac/SlickGrid/issues/356) ([31dc311](https://github.com/6pac/SlickGrid/commit/31dc311156d0ccc4003782c9e54d2b7ed271a3d9))
* **autoheight:** updateRowCount shouldn't set virtual height, fixes [#364](https://github.com/6pac/SlickGrid/issues/364) ([8c39435](https://github.com/6pac/SlickGrid/commit/8c39435792cd571709f58cf6919bfa457a3eef51)), closes [#209](https://github.com/6pac/SlickGrid/issues/209)
* **examples:** Select2 examples have some glitches ([#361](https://github.com/6pac/SlickGrid/issues/361)) ([879d918](https://github.com/6pac/SlickGrid/commit/879d918d4f521f47c35ff4b84b8d84d1dcaba1a4))
* **rowDetail:** override formatter, don't use global grid instance ([cde548d](https://github.com/6pac/SlickGrid/commit/cde548d918716c38e22968f9d05460674ad30837))

### Features

* **checkbox:** add possibility to override directly from plugin options ([72c951a](https://github.com/6pac/SlickGrid/commit/72c951a0c02ce9e02c9e41ff1b24a41c3059df1d))

## [2.4.5](https://github.com/6pac/SlickGrid/compare/2.4.4...2.4.5) (2019-03-24)

### Bug Fixes

* **update:** fix update an item id using DataView, closes [#353](https://github.com/6pac/SlickGrid/issues/353) ([e06fe06](https://github.com/6pac/SlickGrid/commit/e06fe06a7b2345366cee8a24a017984e6a2df688))

### Features

* **gridMenu:** add grid UID to the GridMenu control ([fd06af5](https://github.com/6pac/SlickGrid/commit/fd06af5bb2b210bd6eb7b1302cf6d017b4bd016f))
* **rowDetail:** add override method to know which row is expandable ([#351](https://github.com/6pac/SlickGrid/issues/351)) ([116addc](https://github.com/6pac/SlickGrid/commit/116addc1196739dbcc2c13a72c040626f1d8dee3))

## [2.4.4](https://github.com/6pac/SlickGrid/compare/2.4.3...2.4.4) (2019-03-02)

### Bug Fixes

* **cellSelection:** deep copy so we can use of shift+arrow, closes [#341](https://github.com/6pac/SlickGrid/issues/341) ([#348](https://github.com/6pac/SlickGrid/issues/348)) ([4ca6c6d](https://github.com/6pac/SlickGrid/commit/4ca6c6dd315326f90dd5d33c939f20a820a2309c))

### Features

* **selectable:** add override method to know which row is selectable ([#346](https://github.com/6pac/SlickGrid/issues/346)) ([f30bf6f](https://github.com/6pac/SlickGrid/commit/f30bf6fc99fd48882e1d25441b63a791ec5bf19c))

## [2.4.3](https://github.com/6pac/SlickGrid/compare/2.4.2...2.4.3) (2019-02-09)

### Bug Fixes

* **examples:** simple button alignement fixes ([#335](https://github.com/6pac/SlickGrid/issues/335)) ([217365e](https://github.com/6pac/SlickGrid/commit/217365e3553aaadb6096661c226e220c84d3bdd4))
* **overflow-scrolling:** remove old patch now unnecessary, closes [#332](https://github.com/6pac/SlickGrid/issues/332) ([fcab948](https://github.com/6pac/SlickGrid/commit/fcab94855a55855cc1b31a94b7435d8ce482b559))
* **selection:** copy text selection now working ([#333](https://github.com/6pac/SlickGrid/issues/333)) ([692785a](https://github.com/6pac/SlickGrid/commit/692785ac23c11d0fc0fa1b2a8749dcb07a106092))
* **selector:** cell range selector was not working when at bottom ([#331](https://github.com/6pac/SlickGrid/issues/331)) ([dcf8194](https://github.com/6pac/SlickGrid/commit/dcf8194267e72b8d808515a127e656ef0ea62381))
* **selector:** cell selector throws error in console when no scroll ([#337](https://github.com/6pac/SlickGrid/issues/337)) ([aa54eae](https://github.com/6pac/SlickGrid/commit/aa54eae0623d74d4cb1fda8d4b7e2133c220eb77))
* **selector:** cell selector throws error in console when no scroll ([#338](https://github.com/6pac/SlickGrid/issues/338)) ([beaa586](https://github.com/6pac/SlickGrid/commit/beaa5863b05833b407b26aa108c461be44999b62))

### Features

* **formatter:** add toolTip to Formatter with extended object ([4db4433](https://github.com/6pac/SlickGrid/commit/4db443398a15f66247f27fa18b1eaaeb0cbeaf55))

## [2.4.2](https://github.com/6pac/SlickGrid/compare/2.4.1...2.4.2) (2019-01-20)

### Features

* **divider:** add divider option to Grid Menu & Column Header Menu ([85b57b1](https://github.com/6pac/SlickGrid/commit/85b57b14d1929c1fbd4db6a08b3211acbe3f615f))

## [2.4.1](https://github.com/6pac/SlickGrid/compare/2.4.0...2.4.1) (2018-12-23)

# [2.4.0](https://github.com/6pac/SlickGrid/compare/2.3.23...2.4.0) (2018-12-23)

### Bug Fixes

* **gridmenu:** should be using grid UID for menu independence ([#305](https://github.com/6pac/SlickGrid/issues/305)) ([443d68d](https://github.com/6pac/SlickGrid/commit/443d68d18283e91d7b1c2bb3403801d7e95b3e9d))
* **gridmenu:** should be using grid UID for menu independence ([#305](https://github.com/6pac/SlickGrid/issues/305)) ([c012add](https://github.com/6pac/SlickGrid/commit/c012addc66a990c57a0c177da6a8c3237c33c678))

### Features

* **checkbox:** add way to show Checbox Selector in Filter Row ([27cbbca](https://github.com/6pac/SlickGrid/commit/27cbbca87b0736edd8364938bfa614666ee23ae3))
* **demo:** add demo for testing grid.autosizeColumns fn, ref [#264](https://github.com/6pac/SlickGrid/issues/264) ([d747468](https://github.com/6pac/SlickGrid/commit/d747468d33997867a6ad90941e106e489e62db4c))
* **grouping:** add caller/originator to updateGroupBy ([7807ef0](https://github.com/6pac/SlickGrid/commit/7807ef037e787d64bc77c1e68b0268b4bf32d9a1))
* **grouping:** add caller/originator to updateGroupBy ([70a25c5](https://github.com/6pac/SlickGrid/commit/70a25c59625f10bb021ecf3e73364d6aba5a3133))
* **picker:** Column Picker expose init to use by translation ([7ea5375](https://github.com/6pac/SlickGrid/commit/7ea5375247b01977a8d81d11ba6937a973a264a4))

## [2.3.23](https://github.com/6pac/SlickGrid/compare/2.3.22...2.3.23) (2018-12-08)

## [2.3.22](https://github.com/6pac/SlickGrid/compare/2.3.21...2.3.22) (2018-12-08)

### Features

* **checkbox:** add way to show Checbox Selector in Filter Row ([f806ad0](https://github.com/6pac/SlickGrid/commit/f806ad0f14d8c754108d14f80c60bbd3e4d5b6ca))
* **demo:** add demo for testing grid.autosizeColumns fn, ref [#264](https://github.com/6pac/SlickGrid/issues/264) ([3d2ef21](https://github.com/6pac/SlickGrid/commit/3d2ef21a95130a5cccef8b649f584f7b6572b885))

## [2.3.21](https://github.com/6pac/SlickGrid/compare/2.3.20...2.3.21) (2018-07-26)

## [2.3.20](https://github.com/6pac/SlickGrid/compare/2.3.19...2.3.20) (2018-07-20)

### Features

* **picker:** Column Picker expose init to use by translation ([6fc6eea](https://github.com/6pac/SlickGrid/commit/6fc6eea9128ef526492b01dd84589e674ff40b6f))

## [2.3.19](https://github.com/6pac/SlickGrid/compare/2.3.18...2.3.19) (2018-05-18)

### Bug Fixes

* **gridMenu:** GridMenu with multiple grids & event leak ([ce0af41](https://github.com/6pac/SlickGrid/commit/ce0af41f540df361c164fb9acebcf589c192a98b))

## [2.3.18](https://github.com/6pac/SlickGrid/compare/2.3.17...2.3.18) (2018-05-12)

### Features

* expose grid in groupitemmetadataprovider ([4c9b501](https://github.com/6pac/SlickGrid/commit/4c9b5016bc2ce08cdded72e4eff0053ec0b1f7bd))

### Reverts

* Revert "fix issue #68 editor with activeRow selection" ([5d9e444](https://github.com/6pac/SlickGrid/commit/5d9e444c49c49753664d711d43567bf40bab4d8f)), closes [#68](https://github.com/6pac/SlickGrid/issues/68)

## [2.3.17](https://github.com/6pac/SlickGrid/compare/2.3.16...2.3.17) (2018-03-08)

## [2.3.16](https://github.com/6pac/SlickGrid/compare/2.3.15...2.3.16) (2018-03-04)

## [2.3.15](https://github.com/6pac/SlickGrid/compare/2.3.14...2.3.15) (2018-02-27)

### Features

* **headerMenu:** autoAlign left if header drop menu is outside viewport ([b8793f6](https://github.com/6pac/SlickGrid/commit/b8793f6eeac714e397875b027e016869a3235d4b))
* **headerMenu:** move the CSS min-width into plugin code ([0a245fa](https://github.com/6pac/SlickGrid/commit/0a245fafb303907ac5d28211cb9b6d95cb449ade))

## [2.3.14](https://github.com/6pac/SlickGrid/compare/2.3.13...2.3.14) (2018-02-27)

## [2.3.13](https://github.com/6pac/SlickGrid/compare/2.3.12...2.3.13) (2018-02-21)

## [2.3.12](https://github.com/6pac/SlickGrid/compare/2.3.11...2.3.12) (2017-12-15)

## [2.3.11](https://github.com/6pac/SlickGrid/compare/2.3.10...2.3.11) (2017-12-10)

## [2.3.10](https://github.com/6pac/SlickGrid/compare/2.3.9...2.3.10) (2017-11-07)

## [2.3.9](https://github.com/6pac/SlickGrid/compare/2.3.8...2.3.9) (2017-11-06)

## [2.3.7](https://github.com/6pac/SlickGrid/compare/2.3.6...2.3.7) (2017-06-13)

## [2.3.5](https://github.com/6pac/SlickGrid/compare/2.3.4...2.3.5) (2017-04-21)

## [2.3.4](https://github.com/6pac/SlickGrid/compare/2.3.3...2.3.4) (2016-11-28)

## [2.3.3](https://github.com/6pac/SlickGrid/compare/2.3.2...2.3.3) (2016-11-24)

### Reverts

* Revert "Added clearItems method to dataview" ([8bc60de](https://github.com/6pac/SlickGrid/commit/8bc60de9e4b048209c6ed47e660cb4cb52b2dae5))

## [2.3.2](https://github.com/6pac/SlickGrid/compare/2.3.1...2.3.2) (2016-08-22)

## [2.3.1](https://github.com/6pac/SlickGrid/compare/2.3.0...2.3.1) (2016-08-19)

## [2.2.6](https://github.com/6pac/SlickGrid/compare/2.2.5...2.2.6) (2016-02-03)

## [2.2.5](https://github.com/6pac/SlickGrid/compare/2.2.4...2.2.5) (2015-09-30)

## [2.2.4](https://github.com/6pac/SlickGrid/compare/2.2.3...2.2.4) (2015-06-02)

## [2.2.3](https://github.com/6pac/SlickGrid/compare/2.2.2...2.2.3) (2015-06-02)

## [2.2.2](https://github.com/6pac/SlickGrid/compare/2.2.1...2.2.2) (2015-03-24)

## [2.2.1](https://github.com/6pac/SlickGrid/compare/2.2.0...2.2.1) (2015-03-17)

# [2.2.0](https://github.com/6pac/SlickGrid/compare/2.1.0...2.2.0) (2015-03-12)

## [2.0.1](https://github.com/6pac/SlickGrid/compare/1.4.3...2.0.1) (2012-04-14)

## [1.4.3](https://github.com/6pac/SlickGrid/compare/1.4.1...1.4.3) (2010-11-05)

## [1.4.1](https://github.com/6pac/SlickGrid/compare/1.3.2...1.4.1) (2010-08-23)

## 1.3.2 (2010-05-18)