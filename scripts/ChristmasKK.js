

class Person 
{
    constructor(_name, _email, _index) 
	{
        this.name = _name;
        this.email = _email;
        this.gifter = null;
        this.index = _index;
    }


	getName()
	{
		return this.name;
	}

    getIndex() 
	{
        return this.index;
    }

    printInfo() 
	{
        console.log("Name: " + this.name);

        if (this.gifter !== null)
		{
            console.log("Gifter Name: " + this.gifter.name);
            console.log("----------------------------------------------------------");
        }
    }

    recursiveRelation(count, length, message) {
        if (count > length) {
            return message;
        }

        message += this.gifter.getIndex().toString() + " -> ";
        return this.gifter.recursiveRelation(count + 1, length, message);
    }

    addGifter(person) {
        this.gifter = person;
    }

    getGiftRecipient() {
        return this.gifter;
    }


	getPersonEmail() {
		return this.email;
	}

    validRelationship() {
        if (this.gifter !== null) {
            if (this.gifter.getGiftRecipient() === null) {
                return true;
            }
            if (this.gifter.getGiftRecipient() !== this) {
                return true;
            }
        }
        return false;
    }
}


class PersonManager 
{
	
	constructor() {
        this.people = [];
        this.gifterstack = [];
        this.processStack = [];
        this.participantsCount = 0;
		emailjs.init("5biBBVET1vCGfjj5u");
		
    }
	

	
	GenerateFauxPeople() {
        for (let i = 0; i < this.participantsCount; i++) {
            this.people.push(new Person(i.toString(), "", i));
            this.gifterstack.push(i);
        }
    }
	
	AddPerson(_name, _email, _index)
	{
		this.people.push(new Person(_name, _email, _index));
		this.gifterstack.push(_index);
		console.log("Name: " + _name + " Email: " + _email + " Index: " + _index);
		this.participantsCount++;
	}
	
	sendEmail(_recipientEmail, _personname, _message) {
        emailjs.send('service_zty630t', 'template_4mh12ue', {
            to_name: _personname,
			to_email: _recipientEmail,
            message: _message,
        })
        .then(function(response) {
            console.log('Email sent:', response);
        })
        .catch(function(error) {
            console.error('Error sending email:', error);
        });
    }
	
	
	
	HamiltonPath() 
	{
		const shuffledIndices = Array.from({ length: this.participantsCount }, (_, i) => i);

		// Shuffle the indices to create a random order
		for (let i = shuffledIndices.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
		}

		for (let i = 0; i < this.participantsCount; i++) {
			const currentIndex = shuffledIndices[i];
			const nextIndex = shuffledIndices[(i + 1) % this.participantsCount];

			if (currentIndex !== nextIndex) {
				this.people[currentIndex].addGifter(this.people[nextIndex]);
			} else {
				const swapIndex = (i + 2) % this.participantsCount;
				this.people[currentIndex].addGifter(this.people[shuffledIndices[swapIndex]]);
				[shuffledIndices[nextIndex], shuffledIndices[swapIndex]] = [shuffledIndices[swapIndex], shuffledIndices[nextIndex]];
			}
		}

		let response = "";
		for (let i = 0; i < this.people.length; i++) {
			response += `ID ${this.people[i].getIndex()}: ${this.people[i].getGiftRecipient().getIndex()} -> `;
			setTimeout(this.sendEmail(this.people[i].getPersonEmail(), this.people[i].getName() ,`The person you are to give a gift to is ${this.people[i].getGiftRecipient().getName()}`), 1000);
		}
		console.log(response);
	}

}

$(document).ready(function() {
	
	
	let peopleCount = 0; // Variable to track the count of people
	const Manager =  new PersonManager();
	
    $('#addPerson').click(function() 
	{
        // Increment the count for each person created
        peopleCount++;

        // Create new input fields for name and email with unique IDs
        const nameInput = $('<input>').attr({
            type: 'text',
            name: 'name' + peopleCount,
            placeholder: 'Enter name',
            class: 'form-control col-md-5',
            id: 'nameInput' + peopleCount // Assigning a unique ID for name input
        });

        const emailInput = $('<input>').attr({
            type: 'email',
            name: 'email' + peopleCount,
            placeholder: 'Enter email',
            class: 'form-control col-md-5',
            id: 'emailInput' + peopleCount // Assigning a unique ID for email input
        });

        // Create a unique ID for the remove button
        const removeButton = $('<button>').addClass('btn btn-danger removeBtn col-md-2').text('Remove').attr('id', 'removeButton' + peopleCount);

        // Append the input fields and remove button to the container
        $('#fieldsContainer').append(nameInput, emailInput, removeButton);

        // Delete button click event to remove the corresponding fields
        $('.removeBtn').click(function() {
            const buttonId = $(this).attr('id');
            const associatedIds = buttonId.match(/\d+/g); // Extracting the number from the button ID
            const personId = associatedIds[0];

            // Removing the associated name, email, and button based on the person ID
            $('#nameInput' + personId).remove();
            $('#emailInput' + personId).remove();
            $(this).remove();
        });
    });
	
	$('#personsForm').submit(function(event) 
	{
		
			var f_name; 
			var email;
			var loopcount = 0;
			
            event.preventDefault(); // Prevents default form submission

            // Get all input values when the form is submitted
            const formData = $(this).serializeArray();
            
            // Display the input values in console
            //console.log(formData);

			
            // Accessing individual input values
            formData.forEach(field => 
			{
				const index = formData.indexOf(field); // Getting the index by finding the element's position in the array
				
				
					
				if ((index + 1) % 2 === 0) 
				{
				// Add 1 to index because index is 0-based
				// If the index is a multiple of 2 (every 2 cycles), call addPerson
					email = field.value;
					Manager.AddPerson(f_name, email, loopcount);
					loopcount++;
				}
				
				else {
					f_name = field.value;
				}

				//console.log(`Index: ${index}, Name: ${field.name}, Value: ${field.value}`);
			});
			
			
			if(loopcount >= 3)
			{
				Manager.HamiltonPath();
			}
        });
		
		

});