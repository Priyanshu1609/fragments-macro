import { Fragment, ReactNode, ReactText, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

const people = [
	{ id: 1, name: "Wade Cooper" },
	{ id: 2, name: "Arlene Mccoy" },
	{ id: 3, name: "Devon Webb" },
	{ id: 4, name: "Tom Cook" },
	{ id: 5, name: "Tanya Fox" },
	{ id: 6, name: "Hellen Schmidt" },
	{ id: 7, name: "Caroline Schultz" },
	{ id: 8, name: "Mason Heaney" },
	{ id: 9, name: "Claudie Smitham" },
	{ id: 10, name: "Emil Schaefer" },
];

function classNames(...classes: any) {
	return classes.filter(Boolean).join(" ");
}

interface IOptionProps {
	readonly chainId: string;
	readonly name: string | ReactNode;
	readonly icon: string;
	// readonly address: string;
}

interface ISelectProps {
	readonly options: IOptionProps[];
	readonly onChange: (value: any) => void;
	readonly value: string;
	readonly placeholder?: string;
}

const Select: React.FC<ISelectProps> = ({
	options,
	onChange,
	value,
	placeholder,
}) => {
	const selectedValue = options?.find((option: any) => option === value);

	return (
		<Listbox
			value={selectedValue}
			onChange={(option) => onChange(option)}
		>
			{({ open }) => (
				<>
					<div className="mt-1 relative text-white">
						<Listbox.Button className="bg-transparent w-full relative rounded-md pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-cryptopurple focus:border-cryptopurple sm:text-sm">
							<div className=" truncate flex p-1">
								{selectedValue?.icon && <img className={selectedValue?.icon && 'mr-3 ml-1'} height="24px" width='24px' src={selectedValue?.icon} />}
								{selectedValue?.name ?? (
									<span>
										{placeholder ?? "Select an option"}
									</span>
								)}
							</div>
							<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
								<SelectorIcon
									className="h-5 w-5 text-gray-400"
									aria-hidden="true"
								/>
							</span>
						</Listbox.Button>

						<Transition
							show={open}
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Listbox.Options className="w-48 absolute z-10 mt-1 bg-[#232529] text-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
								{options?.map((option) => (
									<Listbox.Option
										// key={option.address ?? option.chainId}
										key={option.chainId}
										className={({ active }) =>
											classNames(
												active
													? "text-white bg-[#2BFFB1]"
													: "text-white",
												"cursor-default select-none relative py-2 pl-3 pr-9"
											)
										}
										value={option}
									>
										{({ selected, active }) => (
											<>
												<div className="flex items-center justify-start space-x-5">
													{option.icon && <img className="h-6 w-6" src={option.icon} />}
													<span
														className={classNames(
															selected
																? "font-semibold"
																: "font-normal",
															"block truncate"
														)}
													>
														{option.name}
													</span>
												</div>
												{selected ? (
													<span
														className={classNames(
															active
																? "text-white"
																: "text-[#2BFFB1]",
															"absolute inset-y-0 right-0 flex items-center pr-4"
														)}
													>
														<CheckIcon
															className="h-5 w-5"
															aria-hidden="true"
														/>
													</span>
												) : null}
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	);
};

export default Select;
