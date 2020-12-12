import {
	Sargasso, utils
}
	from '@pelagiccreatures/sargasso'

class uploadableImage extends Sargasso {
	constructor (elem, options) {
		super(elem, options)
		this.columnName = this.element.getAttribute('data-column-name')
		this.maxHeight = this.element.getAttribute('data-max-height') ? this.element.getAttribute('data-max-height') : 200
		this.maxWidth = this.element.getAttribute('data-max-width') ? this.element.getAttribute('data-max-width') : 200
		this.sendResized = this.element.getAttribute('data-send-resized')
		this.input = document.querySelector(this.element.getAttribute('data-target'))

		this.previewElement = document.querySelector('[data-name="' + this.columnName + '-preview"]')
		this.widthElement = document.querySelector('[data-name="' + this.columnName + '-width"]')
		this.heightElement = document.querySelector('[data-name="' + this.columnName + '-height"]')
		this.metadata = this.element.closest('.input-group').querySelector('.metadata')
	}

	start () {
		super.start()
		this.on('change', '', (e) => {
			this.processImage(e.target.files[0])
		})
	};

	sleep () {
		this.off('change', '')
		super.sleep()
	};

	processImage (file) {
		var reader = new FileReader()

		// make a thumbnail once data is loaded
		reader.onload = (readerEvent) => {
			var image = new Image()
			image.onload = (imageEvent) => {
				var canvas = document.createElement('canvas')
				var w = image.width
				var h = image.height
				if (w > h) {
					if (w > this.maxWidth) {
						h *= this.maxWidth / w
						w = this.maxWidth
					}
				} else {
					if (h > this.maxHeight) {
						w *= this.maxHeight / h
						h = this.maxHeight
					}
				}
				canvas.width = w
				canvas.height = h
				canvas.getContext('2d').drawImage(image, 0, 0, w, h)
				var dataURL = canvas.toDataURL('image/jpeg', 1.0)
				this.previewElement.innerHTML = '<img src="' + dataURL + '">'
				this.metadata.innerHTML = '<strong><em>New image</em></strong> w: <strong>' + image.naturalWidth + '</strong> h: <strong>' + image.naturalHeight + '</strong>'

				if (this.sendResized) {
					this.input.value = dataURL
					this.widthElement.value = w
					this.heightElement.value = h
				} else {
					this.widthElement.value = image.naturalWidth
					this.heightElement.value = image.naturalHeight
				}
			}

			// pipe the file data into the image
			image.src = readerEvent.target.result

			if (!this.sendResized) {
				this.input.value = readerEvent.target.result
			}
		}

		// start reading the file
		reader.readAsDataURL(file)
	}
}

utils.registerSargassoClass('uploadableImage', uploadableImage)

export {
	uploadableImage
}
