import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { toast } from "sonner";

type SearchResult = {
	chunk: string;
	distance: number;
};

export function SearchTab() {
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!query.trim()) {
			toast.error("Please enter a search query");
			return;
		}

		setLoading(true);
		try {
			const response = await fetch("/api/search", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ query }),
			});

			const { results } = await response.json();
			setSearchResults(results);
		} catch (error) {
			console.error("Failed to search:", error);
			toast.error("Failed to perform search. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Search Knowledge Base</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<form onSubmit={handleSearch} className="flex gap-2">
					<Input
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Enter your search query..."
						className="flex-1"
					/>
					<Button type="submit" disabled={loading}>
						Search
					</Button>
				</form>

				<ScrollArea className="h-[500px] pr-4">
					{searchResults.length > 0 ? (
						<div className="space-y-4">
							{searchResults.map((result, i) => (
								<Card key={i}>
									<CardContent className="pt-4">
										<div className="text-sm space-y-2">
											<div className="font-mono text-xs text-muted-foreground">
												Similarity: {(1 - result.distance).toFixed(3)}
											</div>
											<div className="bg-muted p-3 rounded-md">
												{result.chunk}
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<div className="text-center text-muted-foreground py-8">
							Search results will appear here
						</div>
					)}
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
