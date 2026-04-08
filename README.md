# AutoPilot

Software Design Patterns - TypeScript examples


## === Software Design Patterns === ##

##Creationals##


**-Factory Method:** Factory Method is a creational design pattern that provides an interface for creating objects in a superclass but allows subclasses to alter the type of objects that will be created. We are using CarFactory as the superclass and CupeFactory and SedanFactory as subclasses. With createCar as Factory Method, the objects are still created via the new operator, but it’s being called from within the createCar factory method.

**-Prototype Patterns:** Is going to be used to create cars when the one that is requested to be created
is the same as the one that was already created.

##Structural##

**-Composite:** is used to create the car with the components and get its price. A car has a components "CompositeComponent" property which has all the car parts, as the CompositeEngine class. The CompositeEngine
has an array of LeafAutoParts like AirFilter, both classes implements the LeafAutoPart interface that has the getAutoPartPrice() method that returns the price of the leaf components or the total prices for the leafcomponents inside the composite object.
.

**-Facade:** Is used on Weather Blackboard library with the BlackBoard Pattern, that gathers information from an array of sources about the weather and then the Autopilot program reads from there. 

**-Flyweight:** Is going to be used to create obstacles to the car movement on the road. A flyweight is a shared object that can be used in multiple context simultaneously. Flyweight can not make assumptions about the context where they operate (the key concept is the distinction between intrinsic and extrinsic state. Instrinsic state is stored in a flyweight. So two or three rocks falling from a mountain could be a flyweigth...).

**Decorator**: is going to be used to add special functionalities to the selected car, like a sound system or automatic light

##Behavioral Patterns##

**-State:** Is a behavioral design pattern that lets an object alter its behavior when its internal state changes. It will be used to define how the car reacts depending on its state. For example, if a rock approaches and its in autopilot it will turn to avoid it. Or a stopped car.
State pattern components:
State: an interface that has a method "react()", and its name property
Context: a class that has an instance of State interface, the methods changeState() and react()
if the user, picks a car the first state is create, if the user starts the car
a second state is created, then if the user presses "A", for autopilot the third state is created. it changes when the 
car finishes.
Concrete Classes: CarPickedState, CarStartedState, CarOnAutopilot;

**-Chain of responsability:** is going to be used to change the gear of the car depending on the speed or environments needs(in front wind).

**-Blackboard**: is going to be used to manage the data input from the outer sensors, like weather and other cars heading 
towards us on the road.

**Strategy**: is going to be used to calculate the autonomy of the car regarding the consumption per km, https://refactoring.guru/design-patterns/strategy  

**Iterator**: is going to be used to check if there is something broken in the car


