"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type UpdatePerson = (key: string, value: string) => void;
export interface Person {
    goal?: string,
    weight?: number,
    age?: number,
    sex?: string,
    height?: number,
    allergies?: string,
    unwanted?: string,
    liked_food?: string,
    language?: string,
    activity?: string,
    calorieIntake?: number
}
interface InputProps {
    id: string;
    defualt?: string;
    label?: string;
    placeholder?: string;
    inputType?: string;
    updatePerson: UpdatePerson;
    options?: string[];
    description?: string;
}

export default function DietPlanPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [person, setPerson] = useState<Person>({});
    const updatePerson: UpdatePerson = (key, value) => {
        let newPerson = { ...person, [key]: value };
        setPerson(newPerson);
    }
    const [dietPlanId, setDietPlanId] = useState<string>("");
    const generateUniqueId = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let uniqueId = '';
        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            uniqueId += characters[randomIndex];
        }
        return uniqueId;
    }
    useEffect(() => {
        setDietPlanId(generateUniqueId());
    }, [])
    const createDietPlan = async () => {
        setIsLoading(true);
        if (!person["goal"] || !person["weight"] || !person["height"] || !person["sex"] || !person["activity"]) {
            alert("Please select your goal, sex, weight, height and activity level!");
            setIsLoading(false);
            return;
        }
        const res = await fetch(process.env.NEXT_PUBLIC_URL + '/api/diet-plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                /*'API-Key': process.env.DATA_API_KEY!,*/
            },
            body: JSON.stringify({ ...person, id: dietPlanId }),
        })
        const data = await res.json()
        console.log(data);
        router.push("/diet-plan/" + dietPlanId);
    }
    return (
        <div className="w-auto flex flex-col items-center">
            <Card className="m-2">
                <CardHeader>
                    <CardTitle>Diet plan</CardTitle>
                    <CardDescription>Create your own diet plan using newest AI technologies</CardDescription>
                </CardHeader>
                <CardContent>
                    <SelectSelection id="goal" updatePerson={updatePerson} placeholder="Select your goal" options={["Loose weight", "Maintain weight", "Gain weight"]} />
                    <RadioSelection id="sex" updatePerson={updatePerson} options={["Man", "Woman"]} defualt="" />
                    <InputWithLabel id="age" updatePerson={updatePerson} label="Age" inputType="number" placeholder="Enter your age" />
                    <InputWithLabel id="weight" updatePerson={updatePerson} label="Weight" inputType="number" placeholder="Enter your weight in kg" />
                    <InputWithLabel id="height" updatePerson={updatePerson} label="Height" inputType="number" placeholder="Enter your height in cm" />
                    <SelectSelection id="activity" updatePerson={updatePerson} placeholder="Select your activity level" options={["Sedentary (little or no exercise)", "Lightly active (exercise 1-3 days/week", "Moderately active (exercise 3-5 days/week)", "Active (exercise 6-7 days/week)", "Very active (hard exercise 6-7 days/week)"]} />
                    <TextArea id="allergies" updatePerson={updatePerson} description="In case you don't have any allergies, you can leave this field empty." label="Allergies" placeholder="Type your allergies here (cockroaches, dogs, pollen, mold, apples...)" />
                    <TextArea id="unwanted" updatePerson={updatePerson} description="If your don't care about unwanted food, you can leave this field empty." label="Unwanted food" placeholder="Type your unwanted food here (apples, rolls, bread, chicken...)" />
                    <TextArea id="liked_food" updatePerson={updatePerson} description="Don't have food preferences? Nevermind, you can leave this field empty." label="Liked food" placeholder="Type your favorite food preferences here (melon, banana, strawberries, pork)" />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button className="w-full my-1" variant="outline">Advanced adjustment features</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium leading-none">Adjustment settings</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Set the adjustments for the diet plan.
                                    </p>
                                </div>
                                <div className="grid gap-2">
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="width">Calorie intake</Label>
                                        <Input
                                            onChange={e => updatePerson("calorieIntake", e.target.value)}
                                            id="calorieIntake"
                                            defaultValue={person.calorieIntake || 0}
                                            type="number"
                                            className="col-span-2 h-8"
                                        />
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <SelectSelection id="language" updatePerson={updatePerson} placeholder="Select your language" options={["English", "Czech"]} />
                </CardContent>
                <CardFooter className="flex flex-col">
                    <Button disabled={isLoading} onClick={() => createDietPlan()} className="w-full">{isLoading ? <Loader2 className="h-6 w-8 animate-spin"></Loader2> : "Create diet plan"}</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

function InputWithLabel(props: InputProps) {
    return (
        <div className="grid w-full items-center gap-1.5 mb-5" >
            <Label htmlFor={props.id}>{props.label}</Label>
            <Input onChange={e => props.updatePerson(props.id, e.target.value)} type={props.inputType} id={props.id} placeholder={props.placeholder} />
        </div >
    )
}

function RadioSelection(props: InputProps) {
    return (
        <RadioGroup onValueChange={e => props.updatePerson(props.id, e)} defaultValue={props.defualt} className="mb-5">
            {(props.options || []).map((option: string, index: number) => (
                <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={"r" + index} />
                    <Label htmlFor={"r" + index}>{option}</Label>
                </div>
            ))}
        </RadioGroup>
    )
}

function CheckboxSelection(props: InputProps) {
    return (
        <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                Accept terms and conditions
            </label>
        </div>
    )
}



function SelectSelection(props: InputProps) {
    return (
        <Select onValueChange={e => props.updatePerson(props.id, e)}>
            <SelectTrigger className="w-full mb-5">
                <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Options</SelectLabel>
                    {(props.options || []).map((option: string) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

function TextArea(props: InputProps) {
    return (
        <div className="grid w-full gap-1.5 mb-5">
            <Label htmlFor="message-2">{props.label}</Label>
            <Textarea onChange={e => props.updatePerson(props.id, e.target.value)} placeholder={props.placeholder} id="message-2" />
            <p className="text-sm text-muted-foreground">
                {props.description}
            </p>
        </div>
    )
}
