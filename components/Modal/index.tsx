/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import { CgCloseR } from "react-icons/cg";
import { Fragment } from "react";
import Button from "../Button";

interface IModal {
	readonly open: boolean;
	readonly onClose: () => void;
	readonly title?: string;
	readonly onOk?: () => void;
	readonly okText?: string;
	readonly width?: string;
	readonly disabled?: boolean;
	readonly loading?: boolean;
	readonly showCTA?: boolean;
	readonly showClose?: boolean;
}

const Modal: React.FC<IModal> = ({
	open,
	onClose,
	title,
	onOk,
	okText,
	children,
	width,
	disabled,
	loading,
	showCTA = true,
	showClose = true
}) => {
	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				as="div"
				className="fixed z-10 inset-0 overflow-y-auto scrollbar-hide "
				onClose={() => { }}
			>
				<div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 text-white overflow-y-auto scrollbar-hide  bg-opacity-70 bg-[#000000]  font-britanica font-normal  ">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0  bg-opacity-70 transition-opacity" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span
						className="hidden sm:inline-block sm:align-middle sm:h-screen"
						aria-hidden="true"
					>
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<Dialog.Panel
							className={`inline-block align-bottom bg-[#232529] py-4 overflow-hidden rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-lg w-full `}
						>
							<div className='w-full pt-4 bg-[#232529] flex justify-between px-8'>
								{<Dialog.Title
									as="h3"
									className="text-2xl leading-6 font-bold "
								>
									{title}
								</Dialog.Title>}
								{showClose &&
									<CgCloseR className='w-7 h-7 text-white cursor-pointer  hover:scale-125 ' onClick={onClose} />}
							</div>
							<div className="px-8">
								<div className="">
									<div className="">{children}</div>
								</div>
							</div>
							{
								showCTA && (
									<div className="mt-5 sm:mt-6">
										<Button
											loading={loading}
											disabled={disabled}
											type="button"
											fullWidth
											// className="w-full"
											// className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cryptopurple sm:text-sm"
											onClick={onOk}
										>
											{okText}
										</Button>
									</div>
								)
							}
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default Modal;
