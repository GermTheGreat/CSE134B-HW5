# Part 4 Exercise: Share footer with Eleventy

Two pages from base portfolio website, Home and About, that share a footer with Eleventy. 

## Requirements
Requires Node.js and npm. 

## Commands
cd ssg-exercise\eleventy-sample
npm install
npm run build
npm start

Server at http://localhost:8080/, or will be printed in terminal after running npm start

## Shared Footer
Shared footer is in `_includes/footer.html` in eleventy_sample. 

https://starlit-cheesecake-20548e.netlify.app/ssg-exercise/eleventy-sample/index.html
technically the footer doesn't show up correctly because Netlify doesn't run npm. 

## Design Note
In the very beginning when the page is first loaded, the state is 'idle' and currentDog, which will keep the dog image url, and the dog breed, is set to null. We have a waiting status for before the button is first pressed, ‘Waiting for dog to be fetched’. Keep in mind that the user can see the ‘status’ paragraph on the page, but not the ‘state’ which works in the background. We want the user to activate the first dog being shown, so in the beginning there is no image or caption. When the ‘Next Dog’ button is clicked, this calls fetchDog(). When fetchDog() is activated, we trigger the ‘loading’ state, during which the ‘Next Dog’ button cannot be pressed (we are finishing the current load request), and the status is set to ‘Fetching dog…’. If fetchDog() works with no errors, we should be able to see the dog image and its caption. fetchDog() makes a call to the Dog CEO API, and also contains many checks that all need to be passed for a successful request response, in the form of a try-catch block. The first is that response.ok from the API call is true. The .json of the response must also have the right content, which will be a string URL and request status, although we only use the URL. We also check that the string can be parsed as a URL. Lastly, we check that the URL protocol is https. If all of these checks are passed, currentDog is replaced with { url, breed }, the ‘state’ is set to ‘success’ and our status is set to ‘Dog successfully fetched.’ If even one of these checks is not passed, or the request throws, we catch the error, log it in the console, the status is set to ‘Error fetching dog. Please try again.’, and the state is set to ‘error’, to signify our unsuccessful or unsatisfactory API call. 
In the background, we have a render() function that will build the page based on currentDog and the state. Render will read the currentDog and ‘state’ to build the UI in that it will determine the status text that is displayed, whether or not the button is enabled (it is only disabled in the ‘loading’ state), the display of the image from the URL, the breed name as a description, and the alt text of the image which also uses the breed. In fact, fetchDog() only directly alters the state before calling render() twice, at the beginning and in the try-catch block, depending on success or failure, to actually set the status and alter the display. 
For some leftover details, we also give the description paragraph role="status" for assistive services. The error status is styled in red because our CSS checks the state in an additional attribute that is attached to the status paragraph and monitors the ‘state’, triggering when the state is ‘error’. Lastly, render() disables the ‘Next Dog’ button only in the ‘loading’ state. In the other three states, the user can click the button again to load the path without a page reload. 


