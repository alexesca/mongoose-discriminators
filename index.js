const mongoose = require('mongoose');
mongoose.connect('mongodb://username:pass@localhost:27017');

const options = { discriminatorKey: 'kind' };

const eventSchema = new mongoose.Schema({ time: Date }, options);
const Event = mongoose.model('Event', eventSchema);

// ClickedLinkEvent is a special type of Event that has
// a URL.
const ClickedLinkEvent = Event.discriminator('ClickedLink',
    new mongoose.Schema({ url: String }, options));

const SignedUpEvent = Event.discriminator('SignedUp',
    new mongoose.Schema({ username: String }, options));

// When you create a generic event, it can't have a URL field...
const genericEvent = new Event({ time: Date.now(), url: 'google.com' });

// But a ClickedLinkEvent can
const clickedEvent = new ClickedLinkEvent({ time: Date.now(), url: 'google.com' });

const signedUpEvent = new SignedUpEvent({ time: Date.now(), username: "octopus" });
const signedUpEvent2 = new SignedUpEvent({ time: Date.now(), username: "hero" });


(async () => {
    await Promise.all([genericEvent.save(), clickedEvent.save(), signedUpEvent.save(), signedUpEvent2.save()]);
    let count = await Event.countDocuments();
    console.log("Event: ", count)
    count = await ClickedLinkEvent.countDocuments();
    console.log("Clicked Event: ", count)
    count = await SignedUpEvent.countDocuments();
    console.log("Signup Event: ", count)
})().then(val => console.log(val))
    .catch(err =>  console.log(err))


