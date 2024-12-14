// const URL = "https://teachablemachine.withgoogle.com/models/1ATZNxu48/";
// const URL = "https://teachablemachine.withgoogle.com/models/rTes7cJF-/";
// const URL = "https://teachablemachine.withgoogle.com/models/rTes7cJF-/";
    const URL = "https://teachablemachine.withgoogle.com/models/SUce83Ftm/"
        var r = {"ORS" : 40,
        "Camlin Glue" : 10,
        "Aachi Chicken Kabab Masala" : 10,
        "Rin Soap" : 10,
        };
        let model, webcam, labelContainer, maxPredictions;
        let detectedObjects = {}; // To store detected objects
        let j = 1;
        let total = 0.00;
        

        function clearCart() {
            // Clear the cart items and prices
            const tbody = document.querySelector('#list');
            const tprice = document.querySelector('#cost');
            tbody.innerHTML = ""; // Remove all rows in the items table
            tprice.innerHTML = ""; // Remove all rows in the prices table
        
            // Reset total and detected objects
            j=1;
            total = 0.00;
            detectedObjects = {};
        
            // Update the total bill display
            document.getElementById("sum").innerHTML = "Total Bill : Rs. 0.00";
            console.log("Cart cleared!");
        }

        function printBill() {
            const billContent = document.getElementById('sum').innerHTML;
            const itemList = document.querySelector('#list').innerHTML;
            const priceList = document.querySelector('#cost').innerHTML;
        
            const printWindow = window.open('', '_blank');
            printWindow.document.write('<html><head><title>Print Bill</title></head><body>');
            printWindow.document.write('<h1>Bill Summary</h1>');
            printWindow.document.write('<table><tr><td><h3>Items</h3><table>' + itemList + '</table></td><td><h3>Prices</h3><table>' + priceList + '</table></td></tr></table>');
            printWindow.document.write('<h2>' + billContent + '</h2>');
            printWindow.document.write('<h3>Scan to Pay</h3>');
            printWindow.document.write('<img src="qrcode.jpg" alt="QR Code" style="width:200px;height:200px;">');
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
        

        // Load the image model and setup the webcam
        async function init() {
            const modelURL = URL + "model.json";
            const metadataURL = URL + "metadata.json";
            const devices = await navigator.mediaDevices.enumerateDevices();

            // load the model and metadata
            model = await tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();

            // Setup webcam with default constraints
            webcam = new tmImage.Webcam(200, 200); // width, height
            await webcam.setup({deviceId: devices[1].deviceId}); // request access to the webcam
            await webcam.play();
            window.requestAnimationFrame(loop);

            // append elements to the DOM
            labelContainer = document.getElementById("label-container");
            for (let i = 0; i < maxPredictions; i++) { // and class labels
                labelContainer.appendChild(document.createElement("div"));
            }
        }

        async function loop() {
            webcam.update(); // update the webcam frame
            await predict();
            window.requestAnimationFrame(loop);
        }

        // run the webcam image through the image model
        async function predict() {
            // predict can take in an image, video or canvas html element
            const prediction = await model.predict(webcam.canvas);
            const tbody = document.querySelector('#list');
            const tprice = document.querySelector('#cost');

            
            for (let i = 0; i < maxPredictions; i++) {
                const className = prediction[i].className;
                const probability = prediction[i].probability.toFixed(2);
                console.log(`Class: ${className}, Probability: ${probability}`);
                // labelContainer.childNodes[i].innerHTML = `${className}: ${probability}`;
                
                // Check for object detection threshold, e.g., 0.5
                if (probability >= 0.9 && !(className in detectedObjects) && className!="NONE" && className!="HAND") {
                    const newRow = document.createElement('tr');
                    const newRow1 = document.createElement('tr');
                    newRow.innerHTML = `<td>${j++}. ${className}</td>`;
                    newRow1.innerHTML = `<td>Rs. ${r[className]}.00</td>`;
                    tbody.appendChild(newRow);
                    tprice.appendChild(newRow1);
                    total=total+r[className];
                    document.getElementById("sum").innerHTML = "Total Bill : Rs. "+total+".00";
                    detectedObjects[className] = true; // Record the detected object
                }
            }
        }

        // Start the camera automatically when the page loads
        window.addEventListener('load', init);
