import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MoreVertical, FileText, Calendar, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCaseSchema, type Case } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Cases() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const { toast } = useToast();

  const { data: cases, isLoading } = useQuery<Case[]>({
    queryKey: ["/api/cases"],
  });

  const form = useForm({
    resolver: zodResolver(insertCaseSchema.extend({
      caseNumber: insertCaseSchema.shape.caseNumber,
      title: insertCaseSchema.shape.title,
      description: insertCaseSchema.shape.description.optional(),
      status: insertCaseSchema.shape.status,
      priority: insertCaseSchema.shape.priority,
    })),
    defaultValues: {
      caseNumber: "",
      title: "",
      description: "",
      status: "open",
      priority: "medium",
    },
  });

  const createCaseMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/cases", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cases"] });
      toast({
        title: "Success",
        description: "Case created successfully",
      });
      setIsNewCaseOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to create case",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createCaseMutation.mutate(data);
  };

  const filteredCases = cases?.filter(
    (c) =>
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-chart-2/10 text-chart-2";
      case "in_progress":
        return "bg-chart-3/10 text-chart-3";
      case "closed":
        return "bg-chart-4/10 text-chart-4";
      case "archived":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-destructive/10 text-destructive";
      case "high":
        return "bg-chart-5/10 text-chart-5";
      case "medium":
        return "bg-chart-3/10 text-chart-3";
      case "low":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Case Management</h1>
          <p className="text-muted-foreground">
            Manage and track all investigation cases
          </p>
        </div>
        <Dialog open={isNewCaseOpen} onOpenChange={setIsNewCaseOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-new-case">
              <Plus className="mr-1 h-4 w-4" />
              New Case
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Case</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="caseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Case Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="CASE-2025-0001"
                            data-testid="input-case-number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-priority">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter case title"
                          data-testid="input-case-title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter case description..."
                          className="min-h-24"
                          data-testid="input-case-description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsNewCaseOpen(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createCaseMutation.isPending}
                    data-testid="button-submit-case"
                  >
                    {createCaseMutation.isPending ? "Creating..." : "Create Case"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search cases by number or title..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-cases"
          />
        </div>
      </div>

      {/* Cases List */}
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-32 animate-pulse bg-card" />
          ))}
        </div>
      ) : filteredCases && filteredCases.length > 0 ? (
        <div className="grid gap-4">
          {filteredCases.map((caseItem) => (
            <Card
              key={caseItem.id}
              className="p-6 hover-elevate cursor-pointer"
              onClick={() => (window.location.href = `/cases/${caseItem.id}`)}
              data-testid={`case-${caseItem.id}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold">{caseItem.title}</h3>
                    <Badge className={getStatusColor(caseItem.status)} variant="secondary">
                      {caseItem.status.replace("_", " ")}
                    </Badge>
                    <Badge className={getPriorityColor(caseItem.priority)} variant="secondary">
                      {caseItem.priority}
                    </Badge>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                    {caseItem.description || "No description provided"}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      <span>{caseItem.caseNumber}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {caseItem.createdAt
                          ? new Date(caseItem.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  data-testid={`button-case-menu-${caseItem.id}`}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No cases found</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            {searchQuery
              ? "Try adjusting your search query"
              : "Get started by creating your first case"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsNewCaseOpen(true)} data-testid="button-empty-new-case">
              <Plus className="mr-1 h-4 w-4" />
              Create Case
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
